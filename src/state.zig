const std = @import("std");
const Io = std.Io;
const Allocator = std.mem.Allocator;
const ArrayList = std.array_list.Managed;
const c = @cImport(@cInclude("string.h"));
const md = @import("md_parser.zig");
const fs = @import("files.zig");
const File = fs.File;

const Errors = error{IndexMD_Missing};

const MAX_FILE_LEN: comptime_int = switch (@TypeOf(std.c.MAXNAMLEN)) {
    comptime_int => std.c.MAXNAMLEN,
    else => 256,
};

const DEFAULT_INDEX_HTML =
    \\<!DOCTYPE html>
    \\<html>
    \\  <body>
    \\  </body>
    \\</html>
;

const State = @This();

allocator: Allocator,
cwd: Io.Dir,
io: Io,
old_files: ArrayList([:0]const u8),
new_files: ArrayList([:0]const u8),
walker: ?Io.Dir.Walker,

pub fn init(allocator: Allocator, io: Io, dir: Io.Dir) !State {
    const old_files = ArrayList([:0]const u8).init(allocator);
    const new_files = ArrayList([:0]const u8).init(allocator);
    return State{
        .cwd = dir,
        .allocator = allocator,
        .old_files = old_files,
        .new_files = new_files,
        .io = io,
        .walker = null,
    };
}

fn readDirs(this: *State) !void {
    if (this.walker != null) {
        this.walker.?.deinit();
    }
    this.walker = try this.cwd.walk(this.allocator);

    this.old_files.clearAndFree();
    try this.old_files.appendSlice(this.new_files.items);
    this.new_files.clearAndFree();

    while (this.walker.?.next(this.io) catch null) |entry| {
        if (entry.kind == .file) {
            try this.new_files.append(entry.path);
        }
    }
}

/// Parse if there is index.html file
/// if not exists, return stock basic index.html
fn getIndexHtml(this: *State) !ArrayList(u8) {
    const index_html: [:0]const u8 = "index.html";
    var indexFile: ?[:0]const u8 = null;

    var index_html_file = ArrayList(u8).init(this.allocator);
    for (this.new_files.items) |file| {
        if (c.strncmp(file, index_html, index_html.len) == 0) {
            indexFile = file;
        }
    }

    if (indexFile == null) {
        try index_html_file.appendSlice(DEFAULT_INDEX_HTML);
    } else {
        @panic("NOT IMPLEMENTED YET");
    }

    return index_html_file;
}

fn genIndexHtml(this: *State) !std.ArrayList(u8) {
    var index_html = try this.getIndexHtml();
    defer index_html.deinit();

    var index_md_file_name: ?[:0]const u8 = null;

    //get index.md file if exists
    const index_md: [:0]const u8 = "index.md";
    for (this.new_files.items) |file| {
        var i = file.len - 1;
        var md_end = index_md.len - 1;
        var is_index = true;
        while (i > 0) {
            if (file[i] != index_md[md_end]) {
                is_index = false;
                break;
            }
            if (md_end == 0 and file[i - 1] == std.fs.path.sep) {
                break;
            } else if (md_end == 0) {
                is_index = false;
                break;
            }
            i -= 1;
            md_end -= 1;
        }
        if (is_index) {
            index_md_file_name = file;
            break;
        }
    }

    if (index_md_file_name == null) {
        return Errors.IndexMD_Missing;
    }

    var index_md_buf = Io.Writer.Allocating.init(this.allocator);
    defer index_md_buf.deinit();
    {
        var index_md_file = try this.cwd.openFile(this.io, index_md_file_name.?, .{});
        defer index_md_file.close(this.io);
        var buf: [56]u8 = undefined;
        var index_reader = index_md_file.reader(this.io, &buf);
        _ = try index_reader.interface.streamRemaining(&index_md_buf.writer);
    }
    return md.transformMd2Html(index_md_buf.written(), this.allocator);
}

pub fn generateWeb(this: *State) !ArrayList(File) {
    try this.readDirs();
    var files = ArrayList(File).init(this.allocator);

    var gen_index_html = try this.genIndexHtml();
    defer gen_index_html.deinit(this.allocator);
    try files.append(.{
        .path = "index.html",
        .data = gen_index_html.items,
    });
    return files;
}

pub fn deinit(self: *State) void {
    if (self.walker != null) {
        self.walker.?.deinit();
    }
    self.old_files.deinit();
    self.new_files.deinit();
}

test "Test generating html from markdown" {
    const t = std.testing;
    var talloc = t.allocator_instance;
    defer {
        if (talloc.deinit() == .leak) {
            @panic("Memory leaked");
        }
    }

    var state = try State.init(
        talloc.allocator(),
        t.io,
        try Io.Dir.cwd().openDir(
            t.io,
            "testDir",
            .{ .iterate = true },
        ),
    );
    defer state.deinit();
    const web = try state.generateWeb();
    defer web.deinit();
    try t.expectEqual(1, web.items.len);
}

test "Test reading directories" {
    const t = std.testing;
    var talloc = t.allocator_instance;
    defer {
        if (talloc.deinit() == .leak) {
            @panic("Memory leaked");
        }
    }
    var state = try State.init(
        talloc.allocator(),
        t.io,
        try Io.Dir.cwd().openDir(
            t.io,
            ".",
            .{ .iterate = true },
        ),
    );
    defer state.deinit();

    const old_len = state.new_files.items.len;
    try state.readDirs();
    const new_len = state.new_files.items.len;
    try t.expect(new_len > old_len);
}
