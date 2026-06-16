project(
  'portgen',
  'c',
  license: 'mit',
  default_options: {'c_std':'c11', 'warning_level':'3'} ,
  meson_version: '>=1.6.0',
  version: '0.0.1'
  )

libuv = dependency('libuv')
bo_arena = dependency('bo_arena')
msn = subproject('bo_meson')
compile_cmds = msn.get_variable('compile_cmds')

portgen_cli = executable('portgen',
  install: true,
  sources: ['src/main.c'],
  dependencies: [libuv, bo_arena])
run_target('run', command: portgen_cli, depends: [portgen_cli, compile_cmds])
