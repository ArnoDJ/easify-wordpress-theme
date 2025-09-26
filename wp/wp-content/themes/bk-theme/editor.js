const { addFilter } = wp.hooks;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, CheckboxControl, SelectControl } = wp.components;
const { createHigherOrderComponent } = wp.compose;
const { Fragment, createElement } = wp.element;

console.log('🔥 bk-theme editor.js loaded ✅');

// Extend block attributes
const addImageAttributes = ( settings, name ) => {
    if ( name !== 'core/image' ) return settings;

    settings.attributes = Object.assign( settings.attributes, {
        bleedUp: { type: 'boolean', default: false },
        bleedDown: { type: 'boolean', default: false },
        bleedLeft: { type: 'boolean', default: false },
        bleedRight: { type: 'boolean', default: false },
        bleedSize: { type: 'string', default: 'm' },
        hideOnMobile: { type: 'boolean', default: false }, // ✅ new attribute
    });

    return settings;
};
addFilter( 'blocks.registerBlockType', 'bk-theme/add-image-attributes', addImageAttributes );

// Add controls in the sidebar
const withImageControls = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        if ( props.name !== 'core/image' ) return createElement(BlockEdit, props);

        const { attributes, setAttributes } = props;
        const { bleedUp, bleedDown, bleedLeft, bleedRight, bleedSize, hideOnMobile } = attributes;

        return createElement(
            Fragment,
            {},
            createElement(BlockEdit, props),
            createElement(
                InspectorControls,
                {},
                createElement(
                    PanelBody,
                    { title: "Bleed Options" },
                    createElement(CheckboxControl, {
                        label: "Bleed Up",
                        checked: bleedUp,
                        onChange: (val) => setAttributes({ bleedUp: val }),
                    }),
                    createElement(CheckboxControl, {
                        label: "Bleed Down",
                        checked: bleedDown,
                        onChange: (val) => setAttributes({ bleedDown: val }),
                    }),
                    createElement(CheckboxControl, {
                        label: "Bleed Left",
                        checked: bleedLeft,
                        onChange: (val) => setAttributes({ bleedLeft: val }),
                    }),
                    createElement(CheckboxControl, {
                        label: "Bleed Right",
                        checked: bleedRight,
                        onChange: (val) => setAttributes({ bleedRight: val }),
                    }),
                    createElement(SelectControl, {
                        label: "Bleed Size",
                        value: bleedSize,
                        options: [
                            { label: 'Small', value: 's' },
                            { label: 'Medium', value: 'm' },
                            { label: 'Large', value: 'l' },
                        ],
                        onChange: (val) => setAttributes({ bleedSize: val }),
                    })
                ),
                createElement(
                    PanelBody,
                    { title: "Responsive Options", initialOpen: false },
                    createElement(CheckboxControl, {
                        label: "Hide on Mobile",
                        checked: hideOnMobile,
                        onChange: (val) => setAttributes({ hideOnMobile: val }),
                    })
                )
            )
        );
    };
}, 'withImageControls' );
addFilter( 'editor.BlockEdit', 'bk-theme/with-image-controls', withImageControls );

// Apply CSS classes to frontend + editor markup
const applyImageClasses = ( extraProps, blockType, attributes ) => {
    if ( blockType.name !== 'core/image' ) return extraProps;

    const { bleedUp, bleedDown, bleedLeft, bleedRight, bleedSize, hideOnMobile } = attributes;
    const classes = [];

    if ( bleedUp ) classes.push( 'bleed-up' );
    if ( bleedDown ) classes.push( 'bleed-down' );
    if ( bleedLeft ) classes.push( 'bleed-left' );
    if ( bleedRight ) classes.push( 'bleed-right' );
    if ( bleedSize ) classes.push( `bleed-${ bleedSize }` );
    if ( hideOnMobile ) classes.push( 'hide-on-mobile' ); // ✅ new class

    if ( classes.length ) {
        extraProps.className = [ extraProps.className, ...classes ].filter(Boolean).join( ' ' );
    }

    return extraProps;
};
addFilter( 'blocks.getSaveContent.extraProps', 'bk-theme/apply-image-classes', applyImageClasses );

// Also apply classes inside editor (BlockListBlock)
addFilter(
    'editor.BlockListBlock',
    'bk-theme/apply-image-classes-editor',
    (BlockListBlock) => (props) => {
        if (props.name !== 'core/image') {
            return createElement(BlockListBlock, props);
        }

        const { bleedUp, bleedDown, bleedLeft, bleedRight, bleedSize, hideOnMobile } = props.attributes;
        const extraClasses = [];

        if (bleedUp) extraClasses.push('bleed-up');
        if (bleedDown) extraClasses.push('bleed-down');
        if (bleedLeft) extraClasses.push('bleed-left');
        if (bleedRight) extraClasses.push('bleed-right');
        if (bleedSize) extraClasses.push(`bleed-${bleedSize}`);
        if (hideOnMobile) extraClasses.push('hide-on-mobile'); // ✅ editor too

        return createElement(BlockListBlock, {
            ...props,
            className: [props.className, ...extraClasses].filter(Boolean).join(' '),
        });
    }
);

// 🔹 Auto-inject arrow into hero-cta buttons
const withHeroCtaArrow = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'core/button') {
            return createElement(BlockEdit, props);
        }

        const { attributes } = props;
        const { className = '' } = attributes;

        // Only act if style class contains "is-style-hero-cta"
        const isHeroCta = className.includes('is-style-hero-cta');

        if (!isHeroCta) {
            return createElement(BlockEdit, props);
        }

        // Wrap original edit output, but inject SVG after text
        return createElement(
            'div',
            { className: 'bk-hero-cta-wrapper' },
            createElement(BlockEdit, props),
            // Add preview of arrow inside editor (not saved separately)
            createElement(RawHTML, {}, `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                </svg>
            `)
        );
    };
}, 'withHeroCtaArrow');

addFilter('editor.BlockEdit', 'bk-theme/with-hero-cta-arrow', withHeroCtaArrow);

// 🔹 Also inject into frontend + editor save output
addFilter('blocks.getSaveContent.extraProps', 'bk-theme/apply-hero-cta-arrow', (extraProps, blockType, attributes) => {
    if (blockType.name !== 'core/button') return extraProps;

    const { className = '' } = attributes;
    if (!className.includes('is-style-hero-cta')) return extraProps;

    // Append an identifying class for styling
    extraProps.className = [extraProps.className, 'bk-hero-cta'].filter(Boolean).join(' ');
    return extraProps;
});

