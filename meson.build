project(
  'portfolio',
  'c',
  meson_version : '>= 1.3.0',
  version : '0.1',
  default_options : ['warning_level=3'],
)


build_dir = meson.current_build_dir()
source_dir = meson.current_source_dir()

dependencies = [
]

sources = [
  'portgen/main.c',
]

exe = executable(
  'portgen',
  sources,
  dependencies : dependencies,
  install : true,
)

#put compile commands on root dir
custom_target('ccmds',
  command: ['cp', build_dir+'/compile_commands.json',
    source_dir+'/compile_commands.json'],
  build_always_stale:  true,
  build_by_default: true,
  output: 'compile_commands.json')

run_target('run',
  command: exe)

test('basic', exe)
