const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextareaControl } = wp.components;
const { Fragment } = wp.element;

registerBlockType("bk-theme/svg-icon", {
    edit: ({ attributes, setAttributes }) => {
        const { svgCode } = attributes;

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="SVG Settings" initialOpen={ true }>
                        <TextareaControl
                            label="Paste SVG code"
                            value={ svgCode }
                            onChange={ (val) => setAttributes({ svgCode: val }) }
                            help="Paste raw <svg>…</svg> markup here."
                        />
                    </PanelBody>
                </InspectorControls>
                <div className="bk-svg-icon">
                    { svgCode
                        ? <div dangerouslySetInnerHTML={{ __html: svgCode }} />
                        : <p style={{ opacity: 0.6 }}>🖼 Paste SVG in block settings</p>
                    }
                </div>
            </Fragment>
        );
    },

    save: ({ attributes }) => {
        const { svgCode } = attributes;
        return (
            <div className="bk-svg-icon" dangerouslySetInnerHTML={{ __html: svgCode }} />
        );
    }
});
