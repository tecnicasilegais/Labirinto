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
          <v-col class="d-flex flex-column" cols="12" lg="5">
            <v-row class="d-flex flex-column">
              <v-col>
                <v-card rounded="lg" elevation="0">
                  <v-card-title>Parâmetros</v-card-title>
                  <v-divider></v-divider>
                  <v-skeleton-loader
                    type="list-item,list-item,list-item,list-item,list-item,actions"
                    v-if="loading"></v-skeleton-loader>
                  <v-card-text v-else>
                    <v-row dense>
                      <v-col class="pr-5">
                        <label for="file_maze" class="pl-0">Arquivo de labirinto</label>
                        <v-file-input class="my-1" dense outlined hide-details="auto" small-chips
                                      v-model="maze.file" @click="fileError = []"
                                      :error-messages="fileError"
                                      id="file_maze"></v-file-input>
                      </v-col>
                      <v-col>
                        <label for="cycles" class="pl-0">Ciclos (em milhares)</label>
                        <v-slider v-model="parameters.cycles.value" dense thumb-label hide-details
                                  id="cycles"
                                  :max="parameters.cycles.max"
                                  :min="parameters.cycles.min"
                                  :step="parameters.cycles.step">
                          <template v-slot:prepend class="ma-0">
                            <v-text-field class="ma-0" v-model="parameters.cycles.value" outlined
                                          dense hide-details single-line type="number"
                                          style="width: 85px">
                            </v-text-field>
                          </template>
                        </v-slider>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col class="pr-5">
                        <label for="temperature_initial" class="pl-0">Temperatura inicial</label>
                        <v-slider v-model="parameters.tempInitial.value" dense thumb-label
                                  hide-details
                                  id="temperature_initial"
                                  :max="parameters.tempInitial.max"
                                  :min="parameters.tempInitial.min"
                                  :step="parameters.tempInitial.step">
                          <template v-slot:prepend>
                            <v-text-field v-model="parameters.tempInitial.value" hide-details dense
                                          outlined single-line type="number" style="width: 85px"
                                          suffix="°C">
                            </v-text-field>
                          </template>
                        </v-slider>
                      </v-col>
                      <v-col>
                        <label for="temperature_variation" class="pl-0">Variação da
                          temperatura</label>
                        <v-slider v-model="parameters.tempVariation.value" dense thumb-label
                                  hide-details
                                  id="temperature_variation"
                                  :max="parameters.tempVariation.max"
                                  :min="parameters.tempVariation.min"
                                  :step="parameters.tempVariation.step">
                          <template v-slot:prepend>
                            <v-text-field v-model="parameters.tempVariation.value" hide-details
                                          dense
                                          outlined single-line type="number" style="width: 85px"
                                          suffix="°C">

                            </v-text-field>
                          </template>
                        </v-slider>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col class="pr-5">
                        <label for="percentage_wrong" class="pl-0">Chance de escolha de vizinho
                          ruim</label>
                        <v-slider v-model="parameters.percentageWrong.value" dense thumb-label
                                  hide-details id="percentage_wrong"
                                  :max="parameters.percentageWrong.max"
                                  :min="parameters.percentageWrong.min"
                                  :step="parameters.percentageWrong.step">
                          <template v-slot:prepend>
                            <v-text-field v-model="parameters.percentageWrong.value" hide-details
                                          dense
                                          outlined single-line type="number" style="width: 85px"
                                          suffix="%">
                            </v-text-field>
                          </template>
                        </v-slider>
                      </v-col>
                      <v-col>
                        <label for="percentage_good" class="pl-0">Chance de escolha de vizinho
                          bom</label>
                        <v-slider v-model="parameters.percentageGood.value" dense thumb-label
                                  hide-details
                                  id="percentage_good"
                                  :max="parameters.percentageGood.max"
                                  :min="parameters.percentageGood.min"
                                  :step="parameters.percentageGood.step">
                          <template v-slot:prepend>
                            <v-text-field v-model="parameters.percentageGood.value" hide-details
                                          dense
                                          outlined single-line type="number" style="width: 85px"
                                          suffix="%">

                            </v-text-field>
                          </template>
                        </v-slider>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col class="pr-5">
                        <label for="path_weight_exit" class="pl-0">Peso de saída do
                          labirinto</label>
                        <v-slider v-model="parameters.pathWeightExit.value" dense thumb-label
                                  hide-details id="path_weight_exit"
                                  :max="parameters.pathWeightExit.max"
                                  :min="parameters.pathWeightExit.min"
                                  :step="parameters.pathWeightExit.step">
                          <template v-slot:prepend>
                            <v-text-field v-model="parameters.pathWeightExit.value" hide-details
                                          dense
                                          outlined single-line type="number" style="width: 85px">
                            </v-text-field>
                          </template>
                        </v-slider>
                      </v-col>
                      <v-col>
                        <label for="path_weight_repeat" class="pl-0">Peso de caminho
                          repetido</label>
                        <v-slider v-model="parameters.pathWeightRepeat.value" dense thumb-label
                                  hide-details id="path_weight_repeat"
                                  :max="parameters.pathWeightRepeat.max"
                                  :min="parameters.pathWeightRepeat.min"
                                  :step="parameters.pathWeightRepeat.step">
                          <template v-slot:prepend>
                            <v-text-field v-model="parameters.pathWeightRepeat.value" hide-details
                                          dense outlined single-line type="number"
                                          style="width: 85px">

                            </v-text-field>
                          </template>
                        </v-slider>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions class="d-flex justify-space-around">
                    <v-btn text color="primary" @click="importTxt">Importar TXT</v-btn>
                    <v-btn text color="primary" @click="solveMaze">Resolver!</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col>
                <v-card rounded="lg" elevation="0">
                  <v-card-title>Saída</v-card-title>
                  <v-divider></v-divider>
                  <v-skeleton-loader
                    type="list-item,list-item,list-item,list-item,list-item,list-item"
                    v-if="loading"></v-skeleton-loader>
                  <v-card-text v-else>
                    <div class="console">
                      <div class="console-top d-flex">
                        <v-spacer></v-spacer>
                        <v-icon @click="clearConsole" color="white" class="mr-2">mdi-delete-sweep
                        </v-icon>
                      </div>
                      <pre class="ma-0" ref="logger">{{ output }}</pre>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="7">
            <v-card rounded="lg" elevation="0">
              <v-card-title>Labirinto</v-card-title>
              <v-divider></v-divider>
              <v-skeleton-loader type="table" v-if="loading"></v-skeleton-loader>
              <v-card-text v-else>
                <v-row>
                  <v-col v-if="maze.rawContent" class="d-flex justify-center">
                    <table class="maze">
                      <tr>
                        <td :style="images.background.tl"></td>
                        <td :style="images.background.t" v-for="i in maze.size" :key="i"></td>
                        <td :style="images.background.tr"></td>
                      </tr>
                      <tr v-for="(line, i) in maze.parsedContent" :key="i">
                        <td :style="images.background.l"></td>
                        <td v-for="(cell, j) in line" :key="j" :style="images.background.grass">
                          <div v-if="cell.content === '1'" :style="images.walls[(i+j)%4]"></div>
                          <div v-else-if="cell.content === 'P'" :style="images.path"></div>
                          <div v-else-if="cell.content === 'E'"
                               :style="images.doors.entrance"></div>
                          <div v-else-if="cell.content === 'S'" :style="images.doors.exit"></div>
                        </td>
                        <td :style="images.background.r"></td>
                      </tr>
                      <tr>
                        <td :style="images.background.bl"></td>
                        <td :style="images.background.b" v-for="i in maze.size" :key="i"></td>
                        <td :style="images.background.br"></td>
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
import { findPath } from '@/app';
import CloneDeep    from 'lodash/cloneDeep';

export default {
  data:    () => ({
    fileError:  [],
    loading:    false,
    parameters: {
      cycles:           { min: 10, max: 1000000, step: 10, value: 10 },
      pathWeightExit:   { min: 10, max: 80, step: 1, value: 10 },
      pathWeightRepeat: { min: 10, max: 80, step: 1, value: 10 },
      percentageGood:   { min: 10, max: 80, step: 1, value: 10 },
      percentageWrong:  { min: 10, max: 80, step: 1, value: 10 },
      tempInitial:      { min: 10, max: 80, step: 1, value: 10 },
      tempVariation:    { min: 10, max: 80, step: 1, value: 10 },
    },
    images:     {
      background: {
        grass: { backgroundImage: `url(${require('@/assets/grass.png')})` },
        tl:    { backgroundImage: `url(${require('@/assets/tl.png')})` },
        t:     { backgroundImage: `url(${require('@/assets/t.png')})` },
        tr:    { backgroundImage: `url(${require('@/assets/tr.png')})` },
        l:     { backgroundImage: `url(${require('@/assets/l.png')})` },
        r:     { backgroundImage: `url(${require('@/assets/r.png')})` },
        bl:    { backgroundImage: `url(${require('@/assets/bl.png')})` },
        b:     { backgroundImage: `url(${require('@/assets/b.png')})` },
        br:    { backgroundImage: `url(${require('@/assets/br.png')})` },
      },
      doors:      {
        entrance: { backgroundImage: `url(${require('@/assets/entrance.png')})` },
        exit:     { backgroundImage: `url(${require('@/assets/exit.png')})` },
      },
      path:       { backgroundImage: `url(${require('@/assets/path.png')})` },
      walls:      [
        { backgroundImage: `url(${require('@/assets/w1.png')})` },
        { backgroundImage: `url(${require('@/assets/w2.png')})` },
        { backgroundImage: `url(${require('@/assets/w3.png')})` },
        { backgroundImage: `url(${require('@/assets/w4.png')})` },
      ],
    },
    maze:       {
      position:      {
        entrance: [],
        exit:     [],
      },
      file:          null,
      parsedContent: null,
      rawContent:    null,
      size:          null,
    },
    output:     '',
  }),
  methods: {
    inp(model) {
      console.log(model);
      model.value = 10;
    },
    clearConsole() {
      this.output = '';
    },
    solveMaze() {
      const {
              workingPath, output,
            } = findPath(CloneDeep(this.maze.parsedContent), this.maze.position, this.parameters);
      this.output += output;
      console.log(workingPath);
    },
    importTxt() {
      if (!this.maze.file) {
        this.maze.rawContent = null;
        this.fileError       = ['Informe um arquivo!'];
        return;
      }
      const reader = new FileReader();

      reader.readAsText(this.maze.file);
      reader.onload  = () => {
        this.maze.rawContent = reader.result;
        const rawLines       = this.maze.rawContent.split(/\n|\r\n/);
        this.maze.size       = parseInt(rawLines.shift(), 10);
        if (this.maze.size <= 1) {
          this.fileError = ['Labirinto muito pequeno!'];
        } else if (this.maze.size > 18) {
          this.fileError = ['Labirinto muito grande!'];
        }

        this.maze.parsedContent = [];
        for (let i = 0; i < this.maze.size; i++) {
          const convertedLine = rawLines[i].split(' ');
          for (let j = 0; j < this.maze.size; j++) {
            const cell = convertedLine[j];
            switch (cell) {
              case 'E':
                this.maze.position.entrance = { line: i, col: j };
                convertedLine[j]            = { wasVisited: false, content: 'E' };
                break;
              case 'S':
                this.maze.position.exit = { line: i, col: j };
                convertedLine[j]        = { wasVisited: false, content: 'S' };
                break;
              case 'P':
                convertedLine[j] = { wasVisited: false, content: 'P' };
                break;
              case '0':
                convertedLine[j] = { wasVisited: false, content: '0' };
                break;
              case '1':
                convertedLine[j] = { wasVisited: false, content: '1' };
                break;
              default:
                this.fileError = ['Malformed maze'];
                return;
            }
          }
          this.maze.parsedContent.push(convertedLine);
        }
        if (this.maze.parsedContent.length > 18) {
          this.fileError = ['Labirinto muito grande!'];
        }
      };
      this.fileError = [];
    },
  },
};
</script>

<style lang="scss">
.console {
  display        : flex;
  flex-direction : column;

  .console-top {
    background-color    : #444;
    background-image    : url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14"><g fill="none" fillRule="evenodd" transform="translate(1 1)"><circle cx="6" cy="6" r="6" fill="%23FF5F56" stroke="%23E0443E" strokeWidth=".5" /><circle cx="26" cy="6" r="6" fill="%23FFBD2E" stroke="%23DEA123" strokeWidth=".5" /><circle cx="46" cy="6" r="6" fill="%2327C93F" stroke="%231AAB29" strokeWidth=".5" /></g></svg>');
    background-position : 15px 10px;
    background-repeat   : no-repeat;
    border-radius       : 10px 10px 0 0;
    display             : inline-block;
    height              : 35px;
    width               : 100%;

    + pre {
      background-color : #272822;
      color-scheme     : dark;
      border-radius    : 0 0 10px 10px;
      color            : #fff;
      display          : flex;
      flex-direction   : column-reverse;
      font-family      : Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      hyphens          : none;
      line-height      : 1.5;
      margin           : .5em 0;
      max-height       : 288px;
      overflow         : auto;
      padding          : 5px 15px 15px;
      tab-size         : 4;
      text-align       : left;
      text-shadow      : 0 1px rgba(0, 0, 0, 0.3);
      white-space      : pre;
      word-break       : normal;
      word-spacing     : normal;
      word-wrap        : normal;
    }
  }
}

::-webkit-scrollbar {
  width : 10px;
}

::-webkit-scrollbar-button {
  height : 0;
  width  : 0;
}

::-webkit-scrollbar-thumb {
  background    : #999;
  border        : 0 none #ffffff;
  border-radius : 50px;
}

::-webkit-scrollbar-thumb:hover {
  background : #bbb;
}

::-webkit-scrollbar-thumb:active {
  background : #000;
}

::-webkit-scrollbar-track {
  background    : #3a3a3a;
  border        : none;
  border-radius : 50px;
}

::-webkit-scrollbar-corner {
  background : transparent;
}

table.maze {
  border          : none;
  border-collapse : collapse;

  > tr > td {
    height     : 48px;
    min-height : 48px;
    min-width  : 48px;
    width      : 48px;
    text-align : center;

    > div {
      height : 100%;
      width  : 100%;
    }
  }
}
</style>
