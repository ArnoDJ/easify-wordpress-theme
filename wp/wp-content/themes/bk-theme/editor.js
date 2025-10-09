/**
 * bk-theme — editor.js
 * Paragraph "Leading Arrow" style with color control (stable version)
 */

if (window.bkThemeEditorLoaded) {
	console.warn('bk-theme editor.js already loaded — skipping duplicate registration');
} else {
	window.bkThemeEditorLoaded = true;

	const { addFilter } = wp.hooks;
	const { createHigherOrderComponent } = wp.compose;
	const { Fragment, createElement } = wp.element;
	const { InspectorControls } = wp.blockEditor;
	const { PanelBody, ColorPalette } = wp.components;

	console.log('🔥 bk-theme editor.js loaded ✅');

	// =======================================================
	// PARAGRAPH: Add arrowColor attribute
	// =======================================================
	addFilter('blocks.registerBlockType', 'bk-theme/arrow-attr', (settings, name) => {
		if (name !== 'core/paragraph') return settings;
		settings.attributes = Object.assign(settings.attributes || {}, {
			arrowColor: { type: 'string', default: '' },
		});
		return settings;
	});

	// =======================================================
	// PARAGRAPH: Add sidebar color control when style active
	// =======================================================
	const withArrowColorControl = createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			if (props.name !== 'core/paragraph') return createElement(BlockEdit, props);

			const { attributes, setAttributes } = props;
			const className = attributes.className || '';
			const isLeadingArrow = className.includes('is-style-leading-arrow');
			const currentColor = attributes.arrowColor || '';

			if (!isLeadingArrow) {
				return createElement(BlockEdit, props);
			}

			const colors =
				wp.data.select('core/block-editor').getSettings().colors || [
					{ name: 'Dark Blue', color: '#135a70' },
					{ name: 'Yellow', color: '#fdbb30' },
					{ name: 'Light Blue', color: '#80bdd9' },
					{ name: 'White', color: '#ffffff' },
					{ name: 'Black', color: '#000000' },
				];

			return createElement(
				Fragment,
				{},
				createElement(BlockEdit, props),
				createElement(
					InspectorControls,
					{},
					createElement(
						PanelBody,
						{ title: 'Arrow Color', initialOpen: true },
						createElement(ColorPalette, {
							colors,
							value: currentColor,
							onChange: (newColor) => setAttributes({ arrowColor: newColor }),
						})
					)
				)
			);
		};
	}, 'withArrowColorControl');

	addFilter('editor.BlockEdit', 'bk-theme/with-arrow-color-control', withArrowColorControl);

	// =======================================================
	// PARAGRAPH: Apply inline arrow color variable to block
	// =======================================================
	addFilter(
		'blocks.getSaveContent.extraProps',
		'bk-theme/arrow-inline-color',
		(extraProps, blockType, attributes) => {
			if (blockType.name !== 'core/paragraph') return extraProps;
			if (!attributes.className?.includes('is-style-leading-arrow')) return extraProps;
			if (!attributes.arrowColor) return extraProps;

			extraProps.style = Object.assign({}, extraProps.style, {
				'--arrow-color': attributes.arrowColor,
			});

			return extraProps;
		}
	);

	// =======================================================
	// PARAGRAPH: Render real arrow span in editor
	// =======================================================
	addFilter(
		'editor.BlockListBlock',
		'bk-theme/arrow-span-editor',
		createHigherOrderComponent((BlockListBlock) => {
			return (props) => {
				if (props.name !== 'core/paragraph') return createElement(BlockListBlock, props);

				const { attributes } = props;
				if (!attributes.className?.includes('is-style-leading-arrow')) {
					return createElement(BlockListBlock, props);
				}

				const style = {
					'--arrow-color': attributes.arrowColor || 'currentColor',
				};

				return createElement(
					'div',
					{ className: 'bk-paragraph-with-arrow', style },
					createElement(
						'span',
						{
							className: 'bk-leading-arrow',
							style: { color: attributes.arrowColor || 'currentColor', marginRight: '0.5em' },
							'aria-hidden': true,
						},
						'\uf061'
					),
					createElement(BlockListBlock, props)
				);
			};
		}, 'withArrowSpanEditor')
	);
}
