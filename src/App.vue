<template>
    <v-app id="inspire">
        <v-app-bar app color="white" flat>
            <v-spacer/>
            <v-toolbar-title class="text-h5">IA - T1</v-toolbar-title>
            <v-spacer/>
        </v-app-bar>

        <v-main class="grey lighten-3">
            <v-container>
                <v-row>
                    <v-col class="d-flex flex-column" cols="12" sm="4">
                        <v-card rounded="lg" elevation="0" class="mb-6">
                            <v-card-title>Parâmetros</v-card-title>
                            <v-divider></v-divider>
                            <v-skeleton-loader type="list-item,list-item,list-item,list-item,list-item,actions"
                                               v-if="loading"></v-skeleton-loader>
                            <v-card-text v-else>
                                <label for="file_maze" class="pl-0">Arquivo de labirinto</label>
                                <v-file-input class="mb-3" dense outlined hide-details="auto" v-model="maze.file"
                                              @click="fileError = []"
                                              :error-messages="fileError" small-chips
                                              id="file_maze"></v-file-input>

                                <label for="cost_colision" class="pl-0">Custo de colisão</label>
                                <v-slider class="mb-3" thumb-label hide-details min="0" max="100"
                                          id="cost_colision"></v-slider>

                                <label for="cost_exit" class="pl-0">Custo de saída</label>
                                <v-slider class="mb-3" thumb-label hide-details min="0" max="100"
                                          id="cost_exit"></v-slider>

                                <label for="rate_crossover" class="pl-0">Taxa de crossover</label>
                                <v-slider class="mb-3" thumb-label hide-details min="0" max="100"
                                          id="rate_crossover"></v-slider>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions class="d-flex justify-center">
                                <v-btn text color="primary" @click="importTxt">Try to solve!</v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-sheet rounded="lg" elevation="0">
                            <v-card-title>Output</v-card-title>
                            <v-divider></v-divider>
                            <v-skeleton-loader type="list-item,list-item,list-item,list-item,list-item,list-item"
                                               v-if="loading"></v-skeleton-loader>
                            <v-card-text v-else v-highlight>
                                <pre class="language- ma-0">testando isso
to em choque
meudeus do ceu
caramba
isso nao pode ser</pre>
                            </v-card-text>
                        </v-sheet>
                    </v-col>

                    <v-col cols="12" sm="8">
                        <v-card rounded="lg" elevation="0">
                            <v-card-title>Labirinto</v-card-title>
                            <v-divider></v-divider>
                            <v-skeleton-loader type="table" v-if="loading"></v-skeleton-loader>
                            <v-card-text v-else>
                                <v-row>
                                    <v-col v-if="maze.rawContent" class="d-flex justify-center">
                                        <table class="maze">
                                            <tr>
                                                <td :style="maze.background.tl"></td>
                                                <td :style="maze.background.t" v-for="i in maze.size" :key="i"></td>
                                                <td :style="maze.background.tr"></td>
                                            </tr>
                                            <tr v-for="(line, i) in maze.parsedContent" :key="i">
                                                <td :style="maze.background.l"></td>
                                                <td v-for="(cell, j) in line" :key="j" :style="maze.background.grass">
                                                    <div v-if="cell === 'wall'" :style="maze.walls[(i+j)%4]"></div>
                                                    <div v-else-if="cell === 'entr'" :style="maze.doors.entrance"></div>
                                                    <div v-else-if="cell === 'exit'" :style="maze.doors.exit"></div>
                                                </td>
                                                <td :style="maze.background.r"></td>
                                            </tr>
                                            <tr>
                                                <td :style="maze.background.bl"></td>
                                                <td :style="maze.background.b" v-for="i in maze.size" :key="i"></td>
                                                <td :style="maze.background.br"></td>
                                            </tr>
                                        </table>
                                    </v-col>
                                    <v-col v-else class="text-center subtitle-1 font-weight-bold">
                                        Informe seu arquivo!
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import 'vue-code-highlight/themes/prism-okaidia.css';
import 'vue-code-highlight/themes/window.css';

export default {
    data   : () => ({
        loading  : false,
        maze     : {
            file         : null,
            rawContent   : null,
            parsedContent: null,
            size         : null,
            background   : {
                grass: {backgroundImage: `url(${require('@/assets/grass.png')})`},
                tl   : {backgroundImage: `url(${require('@/assets/tl.png')})`},
                t    : {backgroundImage: `url(${require('@/assets/t.png')})`},
                tr   : {backgroundImage: `url(${require('@/assets/tr.png')})`},
                l    : {backgroundImage: `url(${require('@/assets/l.png')})`},
                r    : {backgroundImage: `url(${require('@/assets/r.png')})`},
                bl   : {backgroundImage: `url(${require('@/assets/bl.png')})`},
                b    : {backgroundImage: `url(${require('@/assets/b.png')})`},
                br   : {backgroundImage: `url(${require('@/assets/br.png')})`}
            },
            walls        : [
                {backgroundImage: `url(${require('@/assets/w1.png')})`},
                {backgroundImage: `url(${require('@/assets/w2.png')})`},
                {backgroundImage: `url(${require('@/assets/w3.png')})`},
                {backgroundImage: `url(${require('@/assets/w4.png')})`}
            ],
            doors        : {
                entrance: {backgroundImage: `url(${require('@/assets/entrance.png')})`},
                exit    : {backgroundImage: `url(${require('@/assets/exit.png')})`}
            }
        },
        fileError: []
    }),
    methods: {
        importTxt() {
            if (!this.maze.file) {
                this.maze.rawContent = null;
                this.fileError       = ['Informe um arquivo!'];
                return;
            }
            let reader = new FileReader();

            reader.readAsText(this.maze.file);
            reader.onload  = () => {
                this.maze.rawContent = reader.result;
                let rawLines         = this.maze.rawContent.split(/\n|\r\n/);
                this.maze.size       = parseInt(rawLines.shift());
                if (this.maze.size <= 1) {
                    this.fileError = ['Labirinto muito pequeno!'];
                } else if (this.maze.size > 18) {
                    this.fileError = ['Labirinto muito grande!'];
                }

                this.maze.parsedContent = [];
                for (let i = 1; i <= this.maze.size; i++) {
                    let convertedLine = i === 0 || i === this.maze.size + 1 ?
                                        Array.from({length: this.maze.size + 2}) :
                                        rawLines[i - 1].split(' ');
                    for (let j = 0; j < this.maze.size; j++) {
                        let cell = convertedLine[j];
                        switch (cell) {
                            case 'E':
                                convertedLine[j] = 'entr';
                                break;
                            case 'S':
                                convertedLine[j] = 'exit';
                                break;
                            case '0':
                                convertedLine[j] = '';
                                break;
                            case '1':
                                convertedLine[j] = 'wall';
                                break;
                        }
                    }
                    this.maze.parsedContent.push(convertedLine);
                }
                if (this.maze.parsedContent.length > 18) {
                    this.fileError = ['Labirinto muito grande!'];
                }
            };
            this.fileError = [];
        }
    }

};
</script>

<style lang="scss">
table.maze {
    border          : none;
    border-collapse : collapse;

    > tr > td {
        height     : 48px;
        width      : 48px;
        text-align : center;

        > div {
            height : 100%;
            width  : 100%;
        }
    }
}
</style>
