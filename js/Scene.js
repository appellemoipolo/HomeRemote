(function () {
    brite.registerView('Scene', {

        create: function () {
            return render('tmpl-Scene', {
                ScenesList: main.zwaveZones
            });
        },

        postDisplay: function () {
            var view = this;
        },

        events: {

        }
    });
})();