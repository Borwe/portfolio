const std = @import("std");
const Io = std.Io;
const Allocator = std.mem.Allocator;
const ArrayList = std.array_list.Managed;


const MAX_FILE_LEN: comptime_int = switch(@TypeOf(std.c.MAXNAMLEN)){
    comptime_int=> std.c.MAXNAMLEN,
    else => 256
};

const State = @This();

allocator: Allocator,
io: Io,
old_files: ArrayList([:0]const u8),
new_files: ArrayList([:0]const u8),

pub fn init(allocator: Allocator, io: Io) !State {
    
    const old_files = ArrayList([:0]const u8).init(allocator);
    const new_files = ArrayList([:0]const u8).init(allocator);
    return State{
        .allocator = allocator,
        .old_files = old_files,
        .new_files = new_files,
        .io = io,
    };
}

pub fn readDirs(this: *State) !void{
    var cwd = try std.Io.Dir.cwd().openDir(this.io, ".", .{.iterate = true});

    var walker =  try cwd.walk(this.allocator);
    defer walker.deinit();

    this.old_files.clearAndFree();
    try this.old_files.appendSlice(this.new_files.items);

    while(walker.next(this.io) catch null )|entry|{
        if(entry.kind == .file){
            try this.new_files.append(entry.path);
        }
    }
}

pub fn deinit(self: *State) void{
    self.old_files.deinit();
    self.new_files.deinit();
}

test "Test reading directories" {
    const t = std.testing;
    var talloc = t.allocator_instance;
    defer {
        if(talloc.deinit() == .leak){
            @panic("Memory leaked");
        }
    }
    var state = try State.init(talloc.allocator(), t.io);
    defer state.deinit();

    const old_len = state.new_files.items.len;
    try state.readDirs();
    const new_len = state.new_files.items.len;
    try t.expect(new_len>old_len);
}
