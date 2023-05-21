var singleTemplate = wp.template("jcfavoritemedia");
var frame = wp.media.view.MediaFrame.Select;

jQuery(document).ready(function($) {
    wp.media.view.MediaFrame.Select = frame.extend({
        initialize: function() {
            frame.prototype.initialize.apply(this, arguments);

            var State = wp.media.controller.State.extend({
                insert: function() {
                    console.log("Something...");
                    this.frame.close();
                }
            });

            this.states.add([
                new State({
                    id: "jcfavoritemedia",
                    search: false,
                    title: "Favorite Media."
                })
            ]);

            // On render
            this.on("content:render:jcfavoritemedia", this.renderJcWpFavoriteMediaContent, this);
        },

        browseRouter: function(routerView) {
            routerView.set({
                upload: {
                    text: wp.media.view.l10n.uploadFilesTitle,
                    priority: 20
                },
                jcfavoritemedia: {
                    text: "Favorite Media",
                    priority: 30
                },
                browse: {
                    text: wp.media.view.l10n.mediaLibraryTitle,
                    priority: 40
                }
            });
        },

        renderJcWpFavoriteMediaContent: function() {
            var self = this;

            var JcWpFavoriteMediaContent = wp.media.View.extend({
                tagName: "div",
                className: "jcfavoritemediacontent",
                template: singleTemplate,
                active: false,
                toolbar: null,
                frame: null,

                events: {
                    "click .attachment": "selectAttachment"
                },
				
				selectAttachment: function(e) {
                    console.log(e);
                    e.preventDefault();
                    var attachmentId = $(e.currentTarget).data("id");

                    // Clear selection and select new item
                    var jcfavoritemediaState = self.states.get("jcfavoritemedia");
                    jcfavoritemediaState.set("selection", new wp.media.model.Selection());

                    $($('.selected')).removeClass("selected");
                    $($(e.currentTarget)).addClass("selected");

                    var selection = jcfavoritemediaState.get("selection");
                    var attachment = wp.media.model.Attachment.get(attachmentId);
                    selection.add(attachment);

                    // this.controller.trigger('selection:toggle');

                    console.log(selection);
					
					self.close(selection.models[0].attributes);

                    // Enable the button to choose and insert
                    console.log(self.toolbar.get("jcfavoritemedia"));
                    self.toolbar.get("jcfavoritemedia").set("disabled", false);
                },

                render: function() {
                    var self = this;
                    var query = wp.media.query({
                        meta_query: [{
                            key: "_favorite",
                            value: 1
                        }]
                    });

                    query.more().done(function() {
                        var attachments = query.models;

                        if (attachments.length > 0) {
                            xxdata["attachments"] = attachments;
                            self.$el.html(self.template(xxdata));

                            var gallery = $('<div class="jcfavoritemedia-gallery"></div>');
                            self.$el.append(gallery);

                            var galleryx = $('<ul tabindex="-1" class="attachments ui-sortable ui-sortable-disabled" id="__attachments-view-69"></ul>');

                            var gallery2 = $('<div class="attachments-wrapper"></div>');
                            attachments.forEach(function(attachment) {
                                var thumbUrl = attachment.attributes.sizes.thumbnail.url;
                                var thumbType = attachment.attributes.type;
                                var thumbSubtype = attachment.attributes.subtype;
                                var thumbOrientation = attachment.attributes.orientation;
                                var thumbId = attachment.attributes.id;
                                var thumbTitle = attachment.attributes.title;
                                var thumbHtml =
                                    '<li tabindex="0" role="checkbox" aria-label="' +
                                    thumbTitle +
                                    '" aria-checked="false" data-id="' +
                                    thumbId +
                                    '" class="attachment save-ready"><div class="attachment-preview js--select-attachment type-' +
                                    thumbType +
                                    " subtype-" +
                                    thumbSubtype +
                                    " " +
                                    thumbOrientation +
                                    '"><div class="thumbnail"><div class="centered"><img src="' +
                                    thumbUrl +
                                    '" draggable="false" alt=""/></div></div></div></li>';

                                galleryx.append(thumbHtml);
                            });
                            gallery.append(gallery2);
                            gallery2.append(galleryx);
                        } else {
                            self.$el.html("<p>No favorite media images found.</p>");
                        }
                    });
                }
            });

            var view = new JcWpFavoriteMediaContent();
            this.content.set(view);
        }
    });
});