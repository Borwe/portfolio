const std = @import("std");
const State = @import("state.zig");
const Io = std.Io;
const Allocator = std.mem.Allocator;

pub fn main(init: std.process.Init) !void {
    const alloc = init.gpa;
    var state = try State.init(alloc);
    defer state.deinit();
}

