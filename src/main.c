#include <stdlib.h>
#define BO_ARENA_IMPLEMENTATION
#include <bo_arena.h>

#define ARENA_SIZE 1024*1024*20 

static void free_arena(bo_arena *arena){
}

int main(int argc, char **argv){
    char *buff = malloc(ARENA_SIZE);
    bo_arena arena = bo_make_arena(buff, ARENA_SIZE, true, free_arena);
    return 0;
}
