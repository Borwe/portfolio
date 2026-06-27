
const std = @import("std");
const Allocator = std.mem.Allocator;
const Io = std.Io;

const Header = struct {
    kind: usize
};

fn is_header(elem: u8) bool{
    return elem == '#';
}

fn is_new_line(elem: u8) bool {
    return elem=='\n';
}

fn getHeaderKind(md_buf: []u8, cursor: *usize) Header{
    var header = Header{.kind=0};
    while(cursor.*<md_buf.len){
        if(is_header(md_buf[cursor.*])){
            header.kind+=1;
        }else{
            break;
        }
        cursor.*+=1;
    }
    return header;
}

fn write_open_header(header: Header, writer: *Io.Writer) !void {
    try writer.print("<h{d}>",.{header.kind});
}


fn write_close_header(header: Header, writer: *Io.Writer) !void {
    try writer.print("</h{d}>\n",.{header.kind});
}

pub fn transformMd2Html(md_buf: []u8, allocator: Allocator) !std.ArrayList(u8) {
    var output = Io.Writer.Allocating.init(allocator);
    const writer = &output.writer;
    var cursor: usize = 0;

    var header: ?Header = null;
    while(cursor<md_buf.len){
        if(is_header(md_buf[cursor])){
            header = getHeaderKind(md_buf, &cursor);
            try write_open_header(header.?,writer);
        }else if(is_new_line(md_buf[cursor])){
            if(header!=null){
                try write_close_header(header.?,writer);
                header=null;
            }
        }else{
            try writer.print("{c}",.{md_buf[cursor]});
        }
        cursor+=1;
    }
    return output.toArrayList();
}
