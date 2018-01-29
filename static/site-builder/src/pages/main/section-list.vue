<script>
    export default {
        name: "section-list",
        props : {
            sections: {
                type: Array
            }
        },
        render(h) {
            return h('div', {
                "class": {
                }
            }, this.sections.map(function(item) {
                return h(item.component, {
                    ref: item._id,
                    attrs: {
                        id: item._id
                    },
                    props: {
                        setting: item.data
                    }
                });
            }));
        }
    };
</script>