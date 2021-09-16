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
                                <v-file-input class="mb-3" dense outlined hide-details="auto" v-model="mazeFile"
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
                                    <v-col v-if="mazeContent">
                                        <v-row v-for="(line, i) in mazeParsed" :key="i">
                                            <v-col v-for="(cell, j) in line" :key="j">
                                                {{ cell }}
                                            </v-col>
                                        </v-row>
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
        loading    : false,
        mazeFile   : null,
        mazeContent: null,
        mazeParsed : null,
        fileError  : []
    }),
    methods: {
        importTxt() {
            if (!this.mazeFile) {
                this.mazeContent = null;
                this.fileError   = ['Informe um arquivo!'];
                return;
            }
            let reader = new FileReader();

            reader.readAsText(this.mazeFile);
            reader.onload  = () => {
                this.mazeContent = reader.result;
                this.mazeParsed  = this.mazeContent.split(/\n|\r\n/);
                if (this.mazeParsed.length > 18) {
                    this.fileError = ['Labirinto muito grande!'];
                }
                for (let i = 0; i < this.mazeParsed.length; i++) {
                    this.mazeParsed[i] = this.mazeParsed[i].split(' ');
                }
                if (this.mazeParsed.length > 18) {
                    this.fileError = ['Labirinto muito grande!'];
                }
            };
            this.fileError = [];
        }
    }

};
</script>

<style lang="scss">
</style>
