
const std = @import("std");
const ArrayList = std.array_list.Managed;
const Allocator = std.mem.Allocator;

pub fn transformMd2Html(md_buf: []u8, allocator: Allocator) ArrayList(u8) {
    var cursor: u64 = 0;
    while(cursor<md_buf.len){
        cursor+=1;
    }
    return ArrayList(u8).init(allocator);
}
