<template>
    <div class="wrap">
        <div class="logic-wrapper token">
            <label for="token" class="label">
                <span class="label-title">Токен из ВК</span>
                <input type="text" id="token" class="token" v-model="token">
            </label>
        </div>
        <div class="logic-wrapper">
            <h2>Данные по глаголу</h2>
            <label for="entry" class="label">
                <span class="label-title">Entry</span>
                <input type="text" id="entry" class="entry" v-model="entry">
            </label>
        </div>
        <hr>
        <div class="logic-wrapper">
            <label for="definition" class="label">
                <span class="label-title">Definition</span>
                <input type="text" id="definition" class="definition" v-model="definition">
            </label>
        </div>
        <hr>
        <div class="logic-wrapper">
            <label v-for="(e, i) in translation" :for="`example-${i}`" class="label">
                <span class="label-title">Translation {{ i + 1 }}</span>
                <span class="wrapper">
                    <input type="text" :id="`translation-${i}`" class="example" v-model="e.value">
                    <button class="remove" @click="removeTranslation(i)">Удалить</button>
                </span>
            </label>
            <button class="add" @click="addTranslation">Добавить</button>
        </div>
        <hr>
        <div class="logic-wrapper">
            <label for="level" class="label">
                <span class="label-title">Level (1, 2, 3)</span>
                <input type="number" id="level" class="level" v-model="level">
            </label>
        </div>
        <hr>
        <div class="logic-wrapper">
            <label for="american" class="label">
                <span class="label-title">Transcription (american)</span>
                <input type="text" id="american" class="american" v-model="american">
            </label>
            <label for="british" class="label">
                <span class="label-title">Transcription (british)</span>
                <input type="text" id="british" class="british" v-model="british">
            </label>
        </div>
        <hr>
        <div class="logic-wrapper">
            <label for="level" class="label">
                <span class="label-title">Video URL</span>
                <input type="text" id="url" class="url" v-model="url">
            </label>
            <label for="level" class="label">
                <span class="label-title">Video Subtitles</span>
                <input type="text" id="sub" class="sub" v-model="sub">
            </label>
        </div>
        <hr>
        <div class="logic-wrapper">
            <label v-for="(e, i) in examples" :for="`example-${i}`" class="label">
                <span class="label-title">Example {{ i + 1 }}</span>
                <span class="wrapper">
                    <input type="text" :id="`example-${i}`" class="example" v-model="e.value">
                    <button class="remove" @click="removeExample(i)">Удалить</button>
                </span>
            </label>
            <button class="add" @click="addExample">Добавить</button>
        </div>
        <button class="add-word" @click="addWord">Добавить слово</button>
        <div class="answer">
            <pre>{{ answer }}</pre>
        </div>
    </div>
</template>

<script>
    import {Axios} from './axios'

    export default {
        data: () => ({
            token: '',
            entry: '',
            definition: '',
            translation: [{value: ''}],
            level: '',
            american: '',
            british: '',
            url: '',
            sub: '',
            examples: [{value: ''}],

            answer: null
        }),
        methods: {
            addExample() {
                this.examples.push({value: ''})
            },
            removeExample(i) {
                if (this.examples.length <= 1) {
                    return
                }
                this.examples.splice(i, 1)
            },
            addTranslation() {
                this.translation.push({value: ''})
            },
            removeTranslation(i) {
                if (this.translation.length <= 1) {
                    return
                }
                this.translation.splice(i, 1)
            },
            async addWord() {
                const word = {
                    entry: this.entry.toLowerCase(),
                    definition: this.definition,
                    translation: this.getTranslations,
                    level: +this.level,
                    transcription: this.transcription,
                    partOfSpeech: 'phrasal verb',
                    video_url: this.url,
                    video_sub: this.sub,
                    examples: this.getExamples,
                    synonyms: []
                }

                try {
                    const response = await Axios.post('/api/dictionary', word, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    })

                    this.answer = `Status Code: ${response.status}`

                    this.entry = ''
                    this.definition = ''
                    this.translation = [{value: ''}]
                    this.level = ''
                    this.american = ''
                    this.british = ''
                    this.url = ''
                    this.sub = ''
                    this.examples = [{value: ''}]
                } catch (e) {
                    this.answer = e
                }
            }
        },
        created() {

        },
        computed: {
            transcription() {
                return JSON.stringify({
                    american: this.american,
                    british: this.british
                })
            },
            getTranslations() {
                const arr = []
                this.translation.map(el => {
                    if (el.value) arr.push(el.value.toLowerCase())
                })
                return arr
            },
            getExamples() {
                const arr = []
                this.examples.map(el => {
                    if (el.value) arr.push(el.value)
                })
                return arr
            }
        },
        watch: {
            answer() {
                const t = setTimeout(() => {
                    this.answer = ''
                    clearTimeout(t)
                }, 8000)
            },
            level(v) {
                if (v > 3) {
                    this.level = 3
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .wrap {
        margin: 0 auto;
        max-width: 460px;
        padding: 40px 0;
        .logic-wrapper {
            margin-bottom: 30px;
            .wrapper {
                width: 100%;
                display: flex;
                input {
                    width: 100%;
                }
                button {
                    margin-left: 7px;
                }
            }
            .label {
                display: flex;
                flex-direction: column;
                margin-bottom: 5px;
            }
        }
    }
    .add-word {
        height: 50px;
        width: 100%;
    }
    .answer {
        position: fixed;
        top: 15px;
        left: 15px;
        border: 3px solid green;
        padding: 15px;
        max-width: 400px;
        width: 400px;
    }
    * {
        box-sizing: border-box;
    }
    pre {
        margin: 0;
        padding: 0;
        white-space: pre-wrap;
    }
</style>
