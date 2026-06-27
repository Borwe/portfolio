const std = @import("std");
const State = @import("state.zig");
const Io = std.Io;
const Allocator = std.mem.Allocator;

pub fn main(init: std.process.Init) !void {
    const io = init.io;
    const alloc = init.gpa;
    var state = try State.init(
        alloc,
        io,
        try Io.Dir.cwd().openDir(
            io,
            ".",
            .{ .iterate = true },
        ),
    );
    defer state.deinit();
}

comptime {
    _ = @import("state.zig");
}
