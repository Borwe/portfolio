#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <assert.h>
#include <stdalign.h>
#include <string.h>
#define BO_ARENA_IMPLEMENTATION
#include <bo_arena.h>

#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <dirent.h>

#define ARENA_SIZE 1024*1024*20 

static void free_arena(bo_arena *arena){
    free(arena->memory);
}

typedef struct Kind {
    size_t size;
    size_t alignment;
}Kind;

static Kind _get_kind(size_t size, size_t align){
    return (Kind){
        .size = size,
        .alignment = align
    };
}

#define get_kind(typ) _get_kind(sizeof(typ), alignof(typ))

typedef struct Array {
    void *data;
    Kind kind;
    size_t len;
    size_t cap;
}Array;


static Array *array_new(bo_arena *arena, Kind kind){
    const Kind array_kind = get_kind(Array);
    Array *array = bo_arena__allocate(arena, array_kind.alignment, array_kind.size, 1);
    assert(array!=NULL);
    *array = (Array){
        .kind = kind,
        .cap = 0,
        .data = NULL,
        .len = 0
    };
    return array;
}

static void array_insert(Array *arr, const void *val, bo_arena *arena){
    if(arr->cap - arr->len == 0){
        const size_t new_capacity = (arr->cap + 2) * 2;
        void *data = bo_arena__allocate(arena, arr->kind.alignment, arr->kind.size, new_capacity);
        assert(data!=NULL);
        data = memcpy(data, arr->data, arr->len);
        bo_arena_free(arena, arr->data);
        arr->data = data;
        arr->cap = new_capacity;
    }
    arr->len+=1;
    void *loc = (void*)((uintptr_t)(arr->data)+(arr->len * arr->kind.size));
    memcpy(loc, val, arr->kind.size);
}

typedef struct State{
    Array *files;
}State;

State *make_state(bo_arena * const arena){
    State *state = NULL;
    bo_allocate_items(state, true, arena, State, 1);
    assert(state!=NULL);
    state->files = array_new(arena, get_kind(Array));
    return state;
}

static void get_all_files(State *state, bo_arena *const arena){
    const Kind charKind = get_kind(char);
    char *cwd = bo_arena__allocate(arena, charKind.alignment, charKind.size, MAXNAMLEN);
    assert(cwd!=NULL);

    {

        void *err = getcwd(cwd, MAXNAMLEN);
        assert(err!=NULL && "Error getting current directory\n");

        FILE *cwd_file = fopen(cwd, "r");
        assert(cwd_file!= NULL);
        struct stat s_cwd_file;
        int descr_cwd = fileno(cwd_file);
        assert(descr_cwd!=-1);
        int result = fstat(descr_cwd, &s_cwd_file);
        assert(result!=-1);

        printf("BLOCK SIZE IS: %d\n",s_cwd_file.st_blksize);
        bo_arena_panic("TODO: Implement traversing directories");
    }

    bo_arena_free(arena, cwd);
}

int main(int argc, char **argv){
    char *buff = malloc(ARENA_SIZE);
    bo_arena arena = bo_make_arena(buff, ARENA_SIZE, true, free_arena);
    State *state = make_state(&arena);
    assert(state!=NULL);
    get_all_files(state, &arena);
    return 0;
}
