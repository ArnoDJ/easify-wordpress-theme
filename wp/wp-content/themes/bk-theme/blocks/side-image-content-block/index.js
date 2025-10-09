(function (blocks, element, blockEditor, components, i18n) {
	const el = element.createElement;
	const Fragment = element.Fragment;
	const { __ } = i18n;
	const { registerBlockType } = blocks;
	const {
		InnerBlocks,
	} = blockEditor;


	registerBlockType("bk-theme/side-image-content-block", {
		title: __("Side Image Content Block", "bk-theme"),
		icon: "align-wide",
		category: "design",
		attributes: {
			imageUrl: { type: "string", default: "" },
			imageAlt: { type: "string", default: "" },
			imageSide: { type: "string", default: "right" },
			minHeight: { type: "string", default: "400px" },
			overlayColor: { type: "string", default: "rgba(0,0,0,0.3)" },
			overlayOpacity: { type: "number", default: 0.3 },
			backgroundColor: { type: "string", default: "" },
		},

		edit: function (props) {
            const { attributes, setAttributes } = props;
            const {
                imageUrl,
                imageAlt,
                imageSide,
                minHeight,
                overlayColor,
                overlayOpacity,
                backgroundColor,
            } = attributes;

            const el = wp.element.createElement;
            const Fragment = wp.element.Fragment;
            const { __ } = wp.i18n;
            const {
                InspectorControls,
                InnerBlocks,
                MediaUpload,
                MediaUploadCheck,
                PanelColorSettings,
                useBlockProps,
            } = wp.blockEditor;
            const { PanelBody, Button, SelectControl, RangeControl, TextControl } = wp.components;

            // ✅ always wrap block in blockProps for proper selection
            const blockProps = useBlockProps({
                className: `side-image-block alignfull image-${imageSide}`,
                style: {
                    minHeight: minHeight,
                    backgroundColor: backgroundColor || undefined,
                    position: "relative",
                },
            });

            const imageElement = imageUrl
                ? el(
                        Fragment,
                        null,
                        el("img", {
                            src: imageUrl,
                            alt: imageAlt || "",
                            style: { width: "100%", height: "100%", objectFit: "cover" },
                        }),
                        el("div", {
                            className: "side-image-block__overlay",
                            style: { backgroundColor: overlayColor, opacity: overlayOpacity },
                        }),
                        el(
                            "div",
                            {
                                className: "side-image-block__edit",
                                style: {
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    zIndex: 5,
                                },
                            },
                            el(
                                MediaUploadCheck,
                                null,
                                el(MediaUpload, {
                                    onSelect: function (media) {
                                        setAttributes({ imageUrl: media.url, imageAlt: media.alt });
                                    },
                                    allowedTypes: ["image"],
                                    render: function (obj) {
                                        return el(
                                            Button,
                                            { variant: "primary", onClick: obj.open, size: "small" },
                                            __("Change Image", "bk-theme")
                                        );
                                    },
                                })
                            )
                        )
                )
                : el(
                        "div",
                        {
                            className: "side-image-block__upload-area",
                            style: {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f5f5f5",
                                minHeight: minHeight,
                            },
                        },
                        el(
                            MediaUploadCheck,
                            null,
                            el(MediaUpload, {
                                onSelect: function (media) {
                                    setAttributes({ imageUrl: media.url, imageAlt: media.alt });
                                },
                                allowedTypes: ["image"],
                                render: function (obj) {
                                    return el(
                                        Button,
                                        { variant: "secondary", onClick: obj.open },
                                        __("Select Image", "bk-theme")
                                    );
                                },
                            })
                        )
                );

            const imageColumn = el(
                "div",
                { className: "side-image-block__image", style: { position: "relative", flex: "1 1 50%" } },
                imageElement
            );

            const contentColumn = el(
                "div",
                { className: "side-image-block__content", style: { flex: "1 1 50%", position: "relative", zIndex: 2 } },
                el(InnerBlocks, null)
            );

            return el(
                Fragment,
                null,
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: __("Layout Settings", "bk-theme") },
                        el(SelectControl, {
                            label: __("Image Side", "bk-theme"),
                            value: imageSide,
                            options: [
                                { label: __("Left", "bk-theme"), value: "left" },
                                { label: __("Right", "bk-theme"), value: "right" },
                            ],
                            onChange: function (val) {
                                setAttributes({ imageSide: val });
                            },
                        }),
                        el(TextControl, {
                            label: __("Min Height", "bk-theme"),
                            value: minHeight,
                            onChange: function (val) {
                                setAttributes({ minHeight: val });
                            },
                            help: __("Accepts px, vh, or rem units", "bk-theme"),
                        })
                    ),
                    el(
                        PanelColorSettings,
                        {
                            title: __("Image Overlay", "bk-theme"),
                            colorSettings: [
                                {
                                    value: overlayColor,
                                    onChange: function (val) {
                                        setAttributes({ overlayColor: val });
                                    },
                                    label: __("Overlay Color", "bk-theme"),
                                },
                            ],
                        },
                        el(RangeControl, {
                            label: __("Overlay Opacity", "bk-theme"),
                            value: overlayOpacity,
                            onChange: function (val) {
                                setAttributes({ overlayOpacity: val });
                            },
                            min: 0,
                            max: 1,
                            step: 0.05,
                        })
                    ),
                    el(
                        PanelColorSettings,
                        {
                            title: __("Background Color", "bk-theme"),
                            colorSettings: [
                                {
                                    value: backgroundColor,
                                    onChange: function (val) {
                                        setAttributes({ backgroundColor: val });
                                    },
                                    label: __("Block Background Color", "bk-theme"),
                                },
                            ],
                        }
                    )
                ),
                el(
                    "section",
                    blockProps,
                    imageSide === "left" ? [imageColumn, contentColumn] : [contentColumn, imageColumn]
                )
            );
        },



		save: function (props) {
			const {
				imageUrl,
				imageAlt,
				imageSide,
				minHeight,
				overlayColor,
				overlayOpacity,
				backgroundColor,
			} = props.attributes;

			return el(
				"section",
				{
					className: "side-image-block alignfull image-" + imageSide,
					style: {
						minHeight: minHeight,
						backgroundColor: backgroundColor || undefined,
					},
				},
				imageSide === "left"
					? [
							imageUrl &&
								el(
									"div",
									{ className: "side-image-block__image" },
									el("img", { src: imageUrl, alt: imageAlt || "" }),
									el("div", {
										className: "side-image-block__overlay",
										style: {
											backgroundColor: overlayColor,
											opacity: overlayOpacity,
										},
									})
								),
							el("div", { className: "side-image-block__content" }, el(InnerBlocks.Content)),
					  ]
					: [
							el("div", { className: "side-image-block__content" }, el(InnerBlocks.Content)),
							imageUrl &&
								el(
									"div",
									{ className: "side-image-block__image" },
									el("img", { src: imageUrl, alt: imageAlt || "" }),
									el("div", {
										className: "side-image-block__overlay",
										style: {
											backgroundColor: overlayColor,
											opacity: overlayOpacity,
										},
									})
								),
					  ]
			);
		},
	});
})(window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n);
