const std = @import("std");

const IsTest = enum {
    Yes,
    No
};

fn mainModule(b: *std.Build, target: std.Build.ResolvedTarget, isTest: IsTest)*std.Build.Module{

    const optimize = switch (isTest) {
        .No => b.standardOptimizeOption(.{}),
        .Yes => .safe
    };


    const xml2 = b.dependency("libxml2",.{
        .target = target,
        .optimize = optimize
    });

    var module = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
        .link_libc = true,
    });
    module.linkLibrary(xml2.artifact("xml"));
    return module;
}

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});

    const exe = b.addExecutable(.{
        .name = "portfolio",
        .root_module = mainModule(b, target, .No),
    });

    b.installArtifact(exe);

    const run_step = b.step("run", "Run the app");

    const run_cmd = b.addRunArtifact(exe);
    run_step.dependOn(&run_cmd.step);

    run_cmd.step.dependOn(b.getInstallStep());


    run_cmd.addPassthruArgs();

    const exe_tests = b.addTest(.{
        .root_module = mainModule(b, target, .Yes),
    });

    const run_exe_tests = b.addRunArtifact(exe_tests);

    const test_step = b.step("test", "Run tests");
    test_step.dependOn(&run_exe_tests.step);
}
