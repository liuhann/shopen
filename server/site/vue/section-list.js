module.exports =  {
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