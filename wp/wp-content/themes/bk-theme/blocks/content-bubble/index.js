(function (wp) {
  const { registerBlockType } = wp.blocks;
  const { __ } = wp.i18n;
  const { useBlockProps, InnerBlocks, InspectorControls } = wp.blockEditor || wp.editor;
  const { PanelBody, SelectControl } = wp.components;
  const UnitControl = wp.components.__experimentalUnitControl || wp.components.UnitControl;

  registerBlockType('bk-theme/content-bubble', {
    edit: ({ attributes, setAttributes }) => {
      const radiusChoice = attributes.radiusChoice || 'm';
      const roundSide    = attributes.roundSide || 'both';
      const gapSide      = attributes.gapSide || 'none';
      const gapSize      = attributes.gapSize || '';

      const className = [
        'is-round-' + roundSide,
        gapSide !== 'none' ? ('is-gap-' + gapSide) : ''
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
            PanelBody, { title: __('Corners & Gap', 'bk-theme'), initialOpen: true },
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
            gapSide !== 'none' && wp.element.createElement(UnitControl, {
              label: __('Whitespace size', 'bk-theme'),
              value: gapSize,
              onChange: (v) => setAttributes({ gapSize: v }),
              units: [{value:'px',label:'px'},{value:'rem',label:'rem'},{value:'%',label:'%'}]
            })
          )
        ),
        // EMPTY container – user can add anything
        wp.element.createElement('div', blockProps,
          wp.element.createElement(InnerBlocks, null)
        )
      );
    },

    save: ({ attributes }) => {
      const radiusChoice = attributes.radiusChoice || 'm';
      const roundSide    = attributes.roundSide || 'both';
      const gapSide      = attributes.gapSide || 'none';
      const gapSize      = attributes.gapSize || '';

      const className = [
        'is-round-' + roundSide,
        gapSide !== 'none' ? ('is-gap-' + gapSide) : ''
      ].filter(Boolean).join(' ');

      const blockProps = (wp.blockEditor || wp.editor).useBlockProps.save({
        className,
        style: {
          '--bubble-radius': 'var(--wp--custom--radius--' + radiusChoice + ')',
          '--bubble-side-gap': gapSize || '0'
        }
      });

      return wp.element.createElement('div', blockProps,
        wp.element.createElement((wp.blockEditor || wp.editor).InnerBlocks.Content)
      );
    }
  });
})(window.wp);
