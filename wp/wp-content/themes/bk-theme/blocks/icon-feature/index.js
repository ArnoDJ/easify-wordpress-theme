(function (blocks, element, blockEditor, components, i18n, apiFetch) {
    var el = element.createElement;
    var __ = i18n.__;
    var RichText = blockEditor.RichText;
    var InspectorControls = blockEditor.InspectorControls;
    var PanelBody = components.PanelBody;
    var ToggleControl = components.ToggleControl;
    var Button = components.Button;
    var MediaUpload = blockEditor.MediaUpload;
    var PanelColorSettings = blockEditor.PanelColorSettings;

    blocks.registerBlockType('bk/icon-feature', {
        title: __('Icon Feature', 'bk'),
        icon: 'star-filled',
        category: 'design',
        attributes: {
            iconSvg: { type: 'string', default: '' },
            showArrow: { type: 'boolean', default: true },
            title: {
                type: 'string',
                source: 'html',
                selector: 'h3',
                default: __('Icon Feature', 'bk')
            },
            text: {
                type: 'string',
                source: 'html',
                selector: 'p',
                default: __('A block with icons on top and text at the bottom.', 'bk')
            },
            iconColor: { type: 'string', default: '' },
            arrowColor: { type: 'string', default: '' },
            titleColor: { type: 'string', default: '' },
            textColor: { type: 'string', default: '' }
        },

        edit: function (props) {
            var attrs = props.attributes;

            return el('div', { className: 'icon-feature' },
                // Inspector controls
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Settings', 'bk'), initialOpen: true },
                        el(ToggleControl, {
                            label: __('Show Arrow', 'bk'),
                            checked: attrs.showArrow,
                            onChange: function (val) {
                                props.setAttributes({ showArrow: val });
                            }
                        }),
                        el(MediaUpload, {
                            onSelect: function (media) {
                                if (media.mime === 'image/svg+xml') {
                                    fetch(media.url)
                                        .then(function (res) { return res.text(); })
                                        .then(function (svg) {
                                            props.setAttributes({ iconSvg: svg });
                                        });
                                } else {
                                    props.setAttributes({ iconSvg: '' });
                                }
                            },
                            allowedTypes: ['image/svg+xml'],
                            render: function (obj) {
                                return el(Button, {
                                    onClick: obj.open,
                                    isSecondary: true
                                }, attrs.iconSvg ? __('Change Icon', 'bk') : __('Select Icon', 'bk'));
                            }
                        })
                    ),
                    el(PanelColorSettings, {
                        title: __('Colors', 'bk'),
                        colorSettings: [
                            {
                                value: attrs.iconColor,
                                onChange: function (color) { props.setAttributes({ iconColor: color }); },
                                label: __('Icon Color', 'bk')
                            },
                            {
                                value: attrs.arrowColor,
                                onChange: function (color) { props.setAttributes({ arrowColor: color }); },
                                label: __('Arrow Color', 'bk')
                            },
                            {
                                value: attrs.titleColor,
                                onChange: function (color) { props.setAttributes({ titleColor: color }); },
                                label: __('Subtitle Color', 'bk')
                            },
                            {
                                value: attrs.textColor,
                                onChange: function (color) { props.setAttributes({ textColor: color }); },
                                label: __('Text Color', 'bk')
                            }
                        ]
                    })
                ),

                // Media row: inline SVG icon + arrow
                el('div', { className: 'bk-icon-feature__media' },
                    attrs.iconSvg &&
                        el('div', {
                            className: 'bk-icon-feature__icon',
                            style: { color: attrs.iconColor },
                            dangerouslySetInnerHTML: { __html: attrs.iconSvg }
                        }),
                    attrs.showArrow &&
                        el('div', {
                                className: 'bk-icon-feature__arrow',
                                style: { color: attrs.arrowColor }
                            },
                            el('svg', {
                                xmlns: 'http://www.w3.org/2000/svg',
                                viewBox: '0 0 448 512',
                                width: '20',
                                height: '20',
                                'aria-hidden': 'true',
                                focusable: 'false'
                            },
                                el('path', {
                                    d: 'M438.6 233.4l-160-160c-12.5-12.5-32.8-12.5-45.3 \
0s-12.5 32.8 0 45.3L338.8 224H32c-17.7 0-32 14.3-32 \
32s14.3 32 32 32h306.8l-105.5 105.4c-12.5 \
12.5-12.5 32.8 0 45.3s32.8 12.5 \
45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3z'
                                })
                            )
                        )
                ),

                // Text content
                el(RichText, {
                    tagName: 'h3',
                    className: 'bk-icon-feature__title',
                    value: attrs.title,
                    onChange: function (val) { props.setAttributes({ title: val }); },
                    placeholder: __('Enter title…', 'bk'),
                    style: { color: attrs.titleColor }
                }),

                el(RichText, {
                    tagName: 'p',
                    className: 'bk-icon-feature__text',
                    value: attrs.text,
                    onChange: function (val) { props.setAttributes({ text: val }); },
                    placeholder: __('Enter description…', 'bk'),
                    style: { color: attrs.textColor }
                })
            );
        },

        save: function (props) {
            var attrs = props.attributes;

            return el('div', { className: 'bk-icon-feature' },
                el('div', { className: 'bk-icon-feature__media' },
                    attrs.iconSvg &&
                        el('div', {
                            className: 'bk-icon-feature__icon',
                            style: { color: attrs.iconColor },
                            dangerouslySetInnerHTML: { __html: attrs.iconSvg }
                        }),
                    attrs.showArrow &&
                        el('div', {
                                className: 'bk-icon-feature__arrow',
                                style: { color: attrs.arrowColor }
                            },
                            el('svg', {
                                xmlns: 'http://www.w3.org/2000/svg',
                                viewBox: '0 0 448 512',
                                width: '20',
                                height: '20',
                                'aria-hidden': 'true',
                                focusable: 'false'
                            },
                                el('path', {
                                    fill: 'currentColor',
                                    d: 'M438.6 233.4l-160-160c-12.5-12.5-32.8-12.5-45.3 \
        0s-12.5 32.8 0 45.3L338.8 224H32c-17.7 0-32 14.3-32 \
        32s14.3 32 32 32h306.8l-105.5 105.4c-12.5 \
        12.5-12.5 32.8 0 45.3s32.8 12.5 \
        45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3z'
                                })
                            )
                        )
                ),
                el(RichText.Content, { tagName: 'h3', className: 'bk-icon-feature__title', value: attrs.title, style: { color: attrs.titleColor } }),
                el(RichText.Content, { tagName: 'p', className: 'bk-icon-feature__text', value: attrs.text, style: { color: attrs.textColor } })
            );
        }

    });
})(window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n, window.wp.apiFetch);
