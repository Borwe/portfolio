const std = @import("std");
const Allocator = std.mem.Allocator;


const MAX_FILE_LEN: comptime_int = switch(@TypeOf(std.c.MAXNAMLEN)){
    comptime_int=> std.c.MAXNAMLEN,
    else => 256
};

const State = @This();

arena: std.heap.ArenaAllocator,
old_files: std.ArrayList([MAX_FILE_LEN]u8),

pub fn init(allocator: Allocator) !State {
    
    var arena = std.heap.ArenaAllocator.init(allocator);
    const old_files = try std.ArrayList([MAX_FILE_LEN]u8).initCapacity(arena.allocator(), 10);
    return State{
        .arena = arena,
        .old_files = old_files,
    };
}

pub fn readDirs(this: *State) void{
    _ =this;
}

pub fn deinit(this: *State) void{
    this.arena.deinit();
}
