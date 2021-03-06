// Namespace for package
Velociratchet = {};

Velociratchet.history = [];

Velociratchet.addToHistory = function( routeName ){
    Velociratchet.history.push( routeName );
}
Velociratchet.removeFromHistory = function(){
    Velociratchet.history.pop();
}
Velociratchet.clearHistory = function() {
    Velociratchet.history = [];
}

// Events for layout template
// Add the following to your Meteor app:
// Template.myLayoutTemplateName.events(Velociratchet.events);
Velociratchet.events = {
    'click a': function ( evt ) {
        Velociratchet.transition = 'vratchet-fade';
    },
    'click a.icon-right-nav': function () {
        Velociratchet.addToHistory(Iron.Location.get().path);
        Velociratchet.transition = 'vratchet-right-to-left';
    },
    'click a.navigate-right': function () {
        Velociratchet.addToHistory(Iron.Location.get().path);
        Velociratchet.transition = 'vratchet-right-to-left';
    },
    'click a.icon-left-nav': function () {
        Velociratchet.removeFromHistory();
        Velociratchet.transition = 'vratchet-left-to-right';
    },
    'click a.navigate-left': function () {
        Velociratchet.removeFromHistory();
        Velociratchet.transition = 'vratchet-left-to-right';
    },
    'click a.toggle': function( event ){
        var toggle = $(event.target);
        if( toggle.hasClass( 'active' ) ){
            toggle.removeClass( 'active' );
        }else{
            toggle.addClass( 'active' );
        }
    },
    'click a.toggle-handle': function( event ){
        var toggle = $(event.target).parent();
        if( toggle.hasClass( 'active' ) ){
            toggle.removeClass( 'active' );
        }else{
            toggle.addClass( 'active' );
        }
    }

};

// Helpers for layout template
// Add the following to your Meteor app:
// Template.myLayoutTemplateName.helpers(Velociratchet.helpers);
Velociratchet.helpers = {
    transition: function () {
        return function (from, to, element) {
            return Velociratchet.transition || 'vratchet-fade';
        }
    }
};

// Spacebar helpers
if( Meteor.isClient ) {

    UI.registerHelper('getPreviousPage', function () {
        return Velociratchet.history[Velociratchet.history.length-1];
    });
    UI.registerHelper('isActive', function (args) {
        return args.hash.menu === args.hash.active ? 'active' : '';
    });
    UI.registerHelper('getCurrentRoute', function () {
        return Router.current().route.getName();
    });
    // XXX: make this a plugin itself?
    var sideToSide = function(fromX, toX) {
        return function(options) {
            options = _.extend({
                duration: 500,
                easing: 'ease-in-out'
            }, options);

            return {
                insertElement: function(node, next, done) {
                    var $node = $(node);

                    $node
                        .css('transform', 'translateX(' + fromX + ')')
                        .insertBefore(next)
                        .velocity({
                            translateX: [0, fromX]
                        }, {
                            easing: options.easing,
                            duration: options.duration,
                            queue: false,
                            complete: function() {
                                console.log('complete');
                                $node.css('transform', '');
                                done();
                            }
                        });
                },
                removeElement: function(node, done) {
                    var $node = $(node);

                    $node
                        .velocity({
                            translateX: [toX]
                        }, {
                            duration: options.duration,
                            easing: options.easing,
                            complete: function() {
                                $node.remove();
                                done();
                            }
                        });
                }
            }
        }
    }
    Momentum.registerPlugin('vratchet-right-to-left', sideToSide('100%', '-100%'));
    Momentum.registerPlugin('vratchet-left-to-right', sideToSide('-100%', '100%'));
    Momentum.registerPlugin('vratchet-fade', function(options) {
        Velociratchet.clearHistory();
        return {
            insertElement: function(node, next) {
                $(node)
                    .css('opacity', '0')
                    .insertBefore(next)
                    .velocity('fadeIn');
            },
            removeElement: function(node) {
                $(node).velocity('fadeOut', function() {
                    $(this).remove();
                });
            }
        }
    });

    Template.body.onRendered(function() {
        var device = null;

        if (/iPad|iPhone/.test(navigator.userAgent))
            device = 'ios';
        else if (/Android/.test(navigator.userAgent))
            device = 'android';
        if (device) {
            document.body.classList.add(device);
        }
    });
}
