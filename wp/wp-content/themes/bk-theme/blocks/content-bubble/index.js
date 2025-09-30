(function (wp) {
  const { registerBlockType, registerBlockStyle } = wp.blocks;
  const { __ } = wp.i18n;
  const { useBlockProps, InnerBlocks, InspectorControls } = wp.blockEditor || wp.editor;
  const { PanelBody, SelectControl, ToggleControl } = wp.components;
  const UnitControl = wp.components.__experimentalUnitControl || wp.components.UnitControl;

  registerBlockType('bk-theme/content-bubble', {
    attributes: {
      radiusChoice: { type: 'string', default: 'm' },
      roundSide: { type: 'string', default: 'both' },
      gapSide: { type: 'string', default: 'none' },
      gapSize: { type: 'string', default: '' },
      equalHeight: { type: 'boolean', default: false },
      imageLeft: { type: 'boolean', default: false },
    },

    edit: ({ attributes, setAttributes }) => {
      const { radiusChoice, roundSide, gapSide, gapSize, equalHeight, imageLeft } = attributes;

      const className = [
        'is-round-' + roundSide,
        gapSide !== 'none' ? ('is-gap-' + gapSide) : '',
        equalHeight ? 'is-equal-height' : '',
        imageLeft ? 'is-image-left' : ''
      ].filter(Boolean).join(' ');

      const blockProps = useBlockProps({
        className,
        style: {
          '--bubble-radius': 'var(--wp--custom--radius--' + radiusChoice + ')',
          '--bubble-side-gap': gapSize || '0'
        }
      });

      return wp.element.createElement(
        wp.element.Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: __('Corners & Gap', 'bk-theme'), initialOpen: true },
            wp.element.createElement(SelectControl, {
              label: __('Rounded side', 'bk-theme'),
              value: roundSide,
              options: [
                { label: __('Both', 'bk-theme'), value: 'both' },
                { label: __('Left only', 'bk-theme'), value: 'left' },
                { label: __('Right only', 'bk-theme'), value: 'right' },
                { label: __('None', 'bk-theme'), value: 'none' }
              ],
              onChange: (v) => setAttributes({ roundSide: v })
            }),
            wp.element.createElement(SelectControl, {
              label: __('Corner size', 'bk-theme'),
              value: radiusChoice,
              options: [
                { label: 'S (8px)', value: 's' },
                { label: 'M (16px)', value: 'm' },
                { label: 'L (24px)', value: 'l' },
                { label: 'XL (36px)', value: 'xl' },
                { label: 'Pill', value: 'pill' }
              ],
              onChange: (v) => setAttributes({ radiusChoice: v })
            }),
            wp.element.createElement(SelectControl, {
              label: __('Whitespace side', 'bk-theme'),
              value: gapSide,
              options: [
                { label: __('None', 'bk-theme'), value: 'none' },
                { label: __('Left', 'bk-theme'), value: 'left' },
                { label: __('Right', 'bk-theme'), value: 'right' }
              ],
              onChange: (v) => setAttributes({ gapSide: v })
            }),
            gapSide !== 'none' &&
              wp.element.createElement(UnitControl, {
                label: __('Whitespace size', 'bk-theme'),
                value: gapSize,
                onChange: (v) => setAttributes({ gapSize: v }),
                units: [
                  { value: 'px', label: 'px' },
                  { value: 'rem', label: 'rem' },
                  { value: '%', label: '%' }
                ]
              })
          ),
          wp.element.createElement(
            PanelBody,
            { title: __('Layout Options', 'bk-theme'), initialOpen: false },
            wp.element.createElement(ToggleControl, {
              label: __('Equal Height', 'bk-theme'),
              checked: equalHeight,
              onChange: (v) => setAttributes({ equalHeight: v })
            }),
            wp.element.createElement(ToggleControl, {
              label: __('Image Left (reverse layout)', 'bk-theme'),
              checked: imageLeft,
              onChange: (v) => setAttributes({ imageLeft: v })
            })
          )
        ),
        wp.element.createElement('div', blockProps, wp.element.createElement(InnerBlocks, null))
      );
    },

    save: ({ attributes }) => {
      const { radiusChoice, roundSide, gapSide, gapSize, equalHeight, imageLeft } = attributes;

      const className = [
        'is-round-' + roundSide,
        gapSide !== 'none' ? ('is-gap-' + gapSide) : '',
        equalHeight ? 'is-equal-height' : '',
        imageLeft ? 'is-image-left' : ''
      ].filter(Boolean).join(' ');

      const blockProps = (wp.blockEditor || wp.editor).useBlockProps.save({
        className,
        style: {
          '--bubble-radius': 'var(--wp--custom--radius--' + radiusChoice + ')',
          '--bubble-side-gap': gapSize || '0'
        }
      });

      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement((wp.blockEditor || wp.editor).InnerBlocks.Content)
      );
    }
  });

  // Bubble bleed stays as block styles (mutually exclusive)
  registerBlockStyle('bk-theme/content-bubble', {
    name: 'bubble-bleed-right',
    label: 'Bubble Bleed Right',
  });
  registerBlockStyle('bk-theme/content-bubble', {
    name: 'bubble-bleed-left',
    label: 'Bubble Bleed Left',
  });
  registerBlockStyle('bk-theme/content-bubble', {
    name: 'bubble-bleed-both',
    label: 'Bubble Bleed Both',
  });
})(window.wp);
