var app = new Vue({
    el: '#app',
    data: {
        steps: [],
        //steps: [{"startDate":"2017-04-02T21:00:00.000Z","endDate":"2017-04-03T21:00:00.000Z","value":0,"unit":"count"},{"startDate":"2017-04-03T21:00:00.000Z","endDate":"2017-04-04T21:00:00.000Z","value":0,"unit":"count"},{"startDate":"2017-04-04T21:00:00.000Z","endDate":"2017-04-05T21:00:00.000Z","value":1740,"unit":"count"},{"startDate":"2017-04-05T21:00:00.000Z","endDate":"2017-04-06T21:00:00.000Z","value":5457,"unit":"count"}],
         distance: [],
        //distance: [{"startDate":"2017-04-02T21:00:00.000Z","endDate":"2017-04-03T21:00:00.000Z","value":0,"unit":"m"},{"startDate":"2017-04-03T21:00:00.000Z","endDate":"2017-04-04T21:00:00.000Z","value":0,"unit":"m"},{"startDate":"2017-04-04T21:00:00.000Z","endDate":"2017-04-05T21:00:00.000Z","value":738.8759765625,"unit":"m"},{"startDate":"2017-04-05T21:00:00.000Z","endDate":"2017-04-06T21:00:00.000Z","value":1429.6796875,"unit":"m"}],
        activities: [],
        loading: false
    },
    created: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    mounted: function() {

    },
    methods: {
        onDeviceReady: function() {
            this.isAuthorized();
        },
        formatDate: function(date) {
            return moment(date).format("ddd, D MMM")
        },
        formatMilliseconds: function(value) {
            var d = moment.duration(value);
            return moment(d._data).format("HH[h] mm[min]");
        },
        requestAuthorization: function() {
            navigator.health.isAvailable(function(e) {
                console.log("available", e)
                navigator.health.requestAuthorization(["steps", "distance", "activity", "heart_rate"],
                    function(success) {
                        console.log("requestAuthorization success", success);
                        if (success) this.getData();
                    }.bind(this), function(error){
                        console.error("requestAuthorization error", error);
                    })
            }, function(e) {
                console.error("not available", e)
            })
        },
        isAuthorized: function(cb) {
            navigator.health.isAuthorized(["steps", "distance", "activity", "heart_rate"],
                function(success) {
                    console.log("isAuthorized success", success);
                    if (!success) this.requestAuthorization();
                    if (success) if (success) this.getData();
                }.bind(this), function(error){
                    console.error("isAuthorized error", error);
                })
        },
        getData: function() {
            var _this = this;
            this.loading = true;
            navigator.health.queryAggregated({
                startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
                endDate: new Date(), // now
                dataType: 'activity',
                bucket: 'day'
            }, function (data) {
                console.log("activity aggregated", data);
                _this.activities = data;
                _this.loading = false;
            }, function (error) {
                console.error("query failed", error)
                _this.loading = false;
            });

            navigator.health.query({
                startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
                endDate: new Date(), // now
                dataType: 'activity'
            }, function (data) {
                console.log("activity raw", data);
            }, function (error) {
                console.error("query failed", error)
            });

            navigator.health.queryAggregated({
                startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
                endDate: new Date(), // now
                dataType: 'steps',
                bucket: 'day'
            }, function (data) {
                console.log("steps", data);
                _this.steps = data;
            }, function (error) {
                console.error("query failed", error)
            });

            navigator.health.queryAggregated({
                startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
                endDate: new Date(), // now
                dataType: 'distance',
                bucket: 'day'
            }, function (data) {
                console.log("distance", data);
                _this.distance = data;
            }, function (error) {
                console.error("query failed", error)
            });

            navigator.health.query({
                startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
                endDate: new Date(), // now
                dataType: 'heart_rate'
            }, function (data) {
                console.log("heart_rate", data);
            }, function (error) {
                console.error("query failed", error)
            });

        },
    }
})