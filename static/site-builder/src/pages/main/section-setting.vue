<template>
    <div class="section-setting" :style="showStyle">
        <header class="top-bar">
            <div class="title">{{section.name}} </div>
            <div class="close" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M18.263 16l10.07-10.07c.625-.625.625-1.636 0-2.26s-1.638-.627-2.263 0L16 13.737 5.933 3.667c-.626-.624-1.637-.624-2.262 0s-.624 1.64 0 2.264L13.74 16 3.67 26.07c-.626.625-.626 1.636 0 2.26.312.313.722.47 1.13.47s.82-.157 1.132-.47l10.07-10.068 10.068 10.07c.312.31.722.468 1.13.468s.82-.157 1.132-.47c.626-.625.626-1.636 0-2.26L18.262 16z"></path></svg>
            </div>
        </header>
        <div class="section-list">
            <div class="theme-setting" v-for="setting in section.settings">
                <div class="theme-setting--text" v-if="setting.type==='text'">
                    <label class="next-label" >{{setting.label}}</label>
                    <input type="text" :value="value[setting.field]" @input="updateValue($event.target.value, setting.field)">
                </div>

                <div class="theme-setting--checkbox" v-if="setting.type==='checkbox'">
                    <input type="checkbox" v-model="value[setting.field]">
                    <label class="inline-label" >{{setting.label}}</label>
                </div>

                <div class="theme-setting--select" v-if="setting.type==='select'">
                    <label class="next-label" >{{setting.label}}</label>
                    <select v-model="value[setting.field]">
                        <option v-for="option in setting.options" :value="option.value">{{option.label}}</option>
                    </select>
                </div>

                <div class="theme-setting--richtext" v-if="setting.type==='richtext'">
                    <label class="next-label" >{{setting.label}}</label>
                    <textarea :value="value[setting.field]" @input="updateValue($event.target.value, setting.field)"></textarea>
                </div>

                <div class="theme-setting--image" v-if="setting.type==='image'">
                    <label class="next-label" >{{setting.label}}</label>
                    <div class="image-preview">
                        <button @click="chooseImage(setting.field)" v-if="!value[setting.field]">选择图片</button>
                        <img @click="chooseImage(setting.field)" v-if="value[setting.field]" :src="value[setting.field]"></img>
                    </div>
                </div>

                <div class="theme-setting--product theme-setting--select" v-if="setting.type==='product'">
                    <label class="next-label" >{{setting.label}}</label>
                    <select v-model="value[setting.field]">
                        <option v-for="(product, key) in globalData.all_products" v-if="key!=='empty'" :value="key">{{product.title}}</option>
                    </select>
                </div>
            </div>

            <button @click="removeSection" class="ui-button" type="button" name="button">
                Remove section
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SectionTemplates",
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            section: {
                type: Object,
            },
        },
        data() {
            return {
                globalData: {}
            };
        },

        async created() {
            const globalData  = await this.ctx.models.website.getGlobalData();
            this.globalData = globalData;
        },

        computed: {
            value() {
                return this.section.data;
            },

            showStyle() {
                if (this.show) {
                    return {
                        transform: 'translateX(0)'
                    };
                } else {
                    return {
                        transform: 'translateX(100%)'
                    };
                }
            }
        },

        methods: {
            close() {
                this.$emit('close');
            },
            chooseTemplate(template) {
                this.$emit('choose', template);
            },
            updateValue(newValue, field) {
                this.value[field] = newValue;
                //this.$emit('change', this.section._id, this.value);
            },
            chooseImage(field) {
                const url = prompt('输入图片地址', 'https://burst.shopifycdn.com/photos/family-holding-hands-in-winter.jpg');
                this.value[field] = url;
            },

            removeSection() {
                this.$emit('remove');
            },
        }
    };
</script>

<style lang="less" scoped>
    .section-setting {
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1);
        .top-bar {
            display: flex;
            .title {
                flex: 1;
            }
            .close {
                cursor: pointer;
                width: 18px;
                margin-right: 10px;
            }
        }
    }

    .section-list {
        padding: 15px;
        position: absolute;
        top: 50px;
        bottom: 0;
        width: 100%;
        left: 0;
        overflow: auto;
        box-sizing: border-box;

        .theme-setting {
            margin: 15px 0;
            .next-label {
                display: block;
                margin-bottom: 5px;
                font-size: 14px;
                font-weight: 400;
                text-transform: initial;
                letter-spacing: initial;
                cursor: pointer;
            }

            .inline-label {
                display: inline-block;
                vertical-align: middle;
                font-size: 14px;
                font-weight: 400;
                text-transform: initial;
                letter-spacing: initial;
                cursor: pointer;
            }


            .theme-setting--text {
                input {
                    width: 100%;
                    display: block;
                    box-sizing: border-box;
                    box-shadow: inset 0 1px 0 0 rgba(63, 63, 68, 0.05);
                    border: 1px solid #d3d5d6;
                    padding: 9px 9px;
                    font-size: 14px;
                    border-radius: 3px;
                }
            }

            .theme-setting--select {

                select {
                    width: 100%;
                    display: block;
                    box-sizing: border-box;
                    box-shadow: inset 0 1px 0 0 rgba(63, 63, 68, 0.05);
                    border: 1px solid #d3d5d6;
                    padding: 9px 9px;
                    font-size: 14px;
                    border-radius: 3px;
                }
            }


            .theme-setting--richtext {
                textarea {
                    width: 100%;
                    display: block;
                    box-sizing: border-box;
                    box-shadow: inset 0 1px 0 0 rgba(63, 63, 68, 0.05);
                    border: 1px solid #d3d5d6;
                    padding: 9px 9px;
                    font-size: 14px;
                    border-radius: 3px;
                    height: 150px;
                }
            }

            .theme-setting--image {
                .image-preview {
                    background-color: #f4f6f8;
                    text-align: center;
                    width: 220px;
                    border: 1px solid #eee;
                    height: 220px;
                    display: flex;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;

                    button {
                        background: -webkit-gradient(linear, left top, left bottom, from(#6371c7), to(#5563c1));
                        -webkit-box-shadow: inset 0 1px 0 0 #6f7bcb;
                        box-shadow: inset 0 1px 0 0 #6f7bcb;
                        color: #ffffff;
                        border: none;
                        padding: 10px;
                        display: inline-block;
                    }
                    img {
                        max-width: calc(100% - 2px);
                        max-height: calc(100% - 2px);
                        margin: auto;
                    }
                }
            }
        }
        ul, li {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        li {
            cursor: pointer;
            padding: 10px;
            border-bottom: 1px solid #ccc;
        }
    }
</style>