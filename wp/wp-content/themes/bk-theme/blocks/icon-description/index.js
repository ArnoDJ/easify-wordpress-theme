(function () {
    const { createElement, Fragment } = wp.element;
    const { registerBlockType } = wp.blocks;
    const { MediaUpload, RichText, InspectorControls, useBlockProps } = wp.blockEditor;
    const { Button, PanelBody } = wp.components;

    registerBlockType('bk-theme/icon-description', {
        title: 'Icon Description',
        icon: 'info-outline',
        category: 'widgets',
        attributes: {
            svgUrl: { type: 'string', default: '' },
            svgAlt: { type: 'string', default: '' },
            lead: { type: 'string', default: '' },
            text: { type: 'string', default: '' }
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const { svgUrl, svgAlt, lead, text } = attributes;

            const blockProps = useBlockProps({
                className: ['icon-description', props.className].join(' ')
            });

            const onSelectSvg = (media) => {
                setAttributes({
                    svgUrl: media.url,
                    svgAlt: media.alt || ''
                });
            };

            return createElement(
                Fragment,
                null,
                createElement(
                    InspectorControls,
                    null,
                    createElement(
                        PanelBody,
                        { title: 'Icon Settings' },
                        createElement(MediaUpload, {
                            onSelect: onSelectSvg,
                            allowedTypes: ['image/svg+xml'],
                            render: ({ open }) =>
                                createElement(
                                    Button,
                                    { onClick: open, variant: 'secondary' },
                                    svgUrl ? 'Change SVG' : 'Select SVG'
                                )
                        })
                    )
                ),
                createElement(
                    'div',
                    { ...blockProps },
                    svgUrl
                        ? createElement('img', {
                              src: svgUrl,
                              alt: svgAlt,
                              className: 'icon-description__icon'
                          })
                        : createElement('div', { className: 'icon-description__placeholder' }, 'No SVG'),
                    createElement(
                        'div',
                        { className: 'icon-description__content' },
                        createElement(RichText, {
                            tagName: 'strong',
                            value: lead,
                            onChange: (value) => setAttributes({ lead: value }),
                            placeholder: 'Highlighted intro...',
                            className: 'icon-description__lead'
                        }),
                        createElement(RichText, {
                            tagName: 'span',
                            value: text,
                            onChange: (value) => setAttributes({ text: value }),
                            placeholder: 'Main description...',
                            className: 'icon-description__text'
                        })
                    )
                )
            );
        },

        save: function (props) {
            const { attributes } = props;
            const { svgUrl, svgAlt, lead, text } = attributes;

            const blockProps = useBlockProps.save({
                className: 'icon-description'
            });

            return createElement(
                'div',
                blockProps,
                svgUrl &&
                    createElement('img', {
                        src: svgUrl,
                        alt: svgAlt,
                        className: 'icon-description__icon'
                    }),
                createElement(
                    'div',
                    { className: 'icon-description__content' },
                    createElement(RichText.Content, {
                        tagName: 'strong',
                        value: lead,
                        className: 'icon-description__lead'
                    }),
                    createElement(RichText.Content, {
                        tagName: 'span',
                        value: text,
                        className: 'icon-description__text'
                    })
                )
            );
        }
    });
})();
