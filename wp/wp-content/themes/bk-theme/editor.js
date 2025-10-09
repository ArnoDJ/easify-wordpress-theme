const { addFilter } = wp.hooks;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, CheckboxControl, SelectControl, ColorPalette } = wp.components;
const { createHigherOrderComponent } = wp.compose;
const { Fragment, createElement, RawHTML } = wp.element;
const { __ } = wp.i18n;

console.log('🔥 bk-theme editor.js loaded ✅');

// =======================================================
// IMAGE BLOCK EXTENSIONS
// =======================================================

const addImageAttributes = (settings, name) => {
	if (name !== 'core/image') return settings;

	settings.attributes = Object.assign(settings.attributes, {
		bleedUp: { type: 'boolean', default: false },
		bleedDown: { type: 'boolean', default: false },
		bleedLeft: { type: 'boolean', default: false },
		bleedRight: { type: 'boolean', default: false },
		bleedSize: { type: 'string', default: 'm' },
		hideOnMobile: { type: 'boolean', default: false },
	});

	return settings;
};
addFilter('blocks.registerBlockType', 'bk-theme/add-image-attributes', addImageAttributes);

const withImageControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (props.name !== 'core/image') return createElement(BlockEdit, props);

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
					{ title: 'Bleed Options' },
					createElement(CheckboxControl, {
						label: 'Bleed Up',
						checked: bleedUp,
						onChange: (val) => setAttributes({ bleedUp: val }),
					}),
					createElement(CheckboxControl, {
						label: 'Bleed Down',
						checked: bleedDown,
						onChange: (val) => setAttributes({ bleedDown: val }),
					}),
					createElement(CheckboxControl, {
						label: 'Bleed Left',
						checked: bleedLeft,
						onChange: (val) => setAttributes({ bleedLeft: val }),
					}),
					createElement(CheckboxControl, {
						label: 'Bleed Right',
						checked: bleedRight,
						onChange: (val) => setAttributes({ bleedRight: val }),
					}),
					createElement(SelectControl, {
						label: 'Bleed Size',
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
					{ title: 'Responsive Options', initialOpen: false },
					createElement(CheckboxControl, {
						label: 'Hide on Mobile',
						checked: hideOnMobile,
						onChange: (val) => setAttributes({ hideOnMobile: val }),
					})
				)
			)
		);
	};
}, 'withImageControls');
addFilter('editor.BlockEdit', 'bk-theme/with-image-controls', withImageControls);

const applyImageClasses = (extraProps, blockType, attributes) => {
	if (blockType.name !== 'core/image') return extraProps;

	const { bleedUp, bleedDown, bleedLeft, bleedRight, bleedSize, hideOnMobile } = attributes;
	const classes = [];

	if (bleedUp) classes.push('bleed-up');
	if (bleedDown) classes.push('bleed-down');
	if (bleedLeft) classes.push('bleed-left');
	if (bleedRight) classes.push('bleed-right');
	if (bleedSize) classes.push(`bleed-${bleedSize}`);
	if (hideOnMobile) classes.push('hide-on-mobile');

	if (classes.length) {
		extraProps.className = [extraProps.className, ...classes].filter(Boolean).join(' ');
	}

	return extraProps;
};
addFilter('blocks.getSaveContent.extraProps', 'bk-theme/apply-image-classes', applyImageClasses);

addFilter(
	'editor.BlockListBlock',
	'bk-theme/apply-image-classes-editor',
	(BlockListBlock) => (props) => {
		if (props.name !== 'core/image') return createElement(BlockListBlock, props);

		const { bleedUp, bleedDown, bleedLeft, bleedRight, bleedSize, hideOnMobile } = props.attributes;
		const extraClasses = [];

		if (bleedUp) extraClasses.push('bleed-up');
		if (bleedDown) extraClasses.push('bleed-down');
		if (bleedLeft) extraClasses.push('bleed-left');
		if (bleedRight) extraClasses.push('bleed-right');
		if (bleedSize) extraClasses.push(`bleed-${bleedSize}`);
		if (hideOnMobile) extraClasses.push('hide-on-mobile');

		return createElement(BlockListBlock, {
			...props,
			className: [props.className, ...extraClasses].filter(Boolean).join(' '),
		});
	}
);

// =======================================================
// HERO CTA BUTTON ARROW
// =======================================================
const withHeroCtaArrow = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (props.name !== 'core/button') return createElement(BlockEdit, props);

		const { attributes } = props;
		const { className = '' } = attributes;
		const isHeroCta = className.includes('is-style-hero-cta');

		if (!isHeroCta) return createElement(BlockEdit, props);

		return createElement(
			'div',
			{ className: 'bk-hero-cta-wrapper' },
			createElement(BlockEdit, props),
			createElement(
				RawHTML,
				{},
				`
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
					<path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h370.7l-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
				</svg>
			`
			)
		);
	};
}, 'withHeroCtaArrow');

addFilter('editor.BlockEdit', 'bk-theme/with-hero-cta-arrow', withHeroCtaArrow);

addFilter('blocks.getSaveContent.extraProps', 'bk-theme/apply-hero-cta-arrow', (extraProps, blockType, attributes) => {
	if (blockType.name !== 'core/button') return extraProps;
	const { className = '' } = attributes;
	if (!className.includes('is-style-hero-cta')) return extraProps;

	extraProps.className = [extraProps.className, 'bk-hero-cta'].filter(Boolean).join(' ');
	return extraProps;
});

// =======================================================
// REGISTER ARROW COLOR ATTRIBUTE FOR PARAGRAPH
// =======================================================
const addArrowColorAttribute = (settings, name) => {
	if (name !== 'core/paragraph') return settings;

	settings.attributes = Object.assign({}, settings.attributes, {
		arrowColor: {
			type: 'string',
			default: '',
		},
	});

	return settings;
};

addFilter('blocks.registerBlockType', 'bk-theme/add-arrow-color-attribute', addArrowColorAttribute);

// =======================================================
// PARAGRAPH STYLE: LIVE PREVIEW FOR LEADING ARROW
// =======================================================
wp.domReady(() => {
	wp.data.subscribe(() => {
		const blocks = wp.data.select('core/block-editor').getBlocks();
		blocks.forEach((block) => {
			if (block.name === 'core/paragraph') {
				const el = document.querySelector(`[data-block="${block.clientId}"]`);
				if (!el) return;
				el.classList.toggle(
					'is-style-leading-arrow',
					block.attributes.className?.includes('is-style-leading-arrow')
				);
			}
		});
	});
});

// =======================================================
// PARAGRAPH STYLE: LEADING ARROW COLOR CONTROL
// =======================================================
wp.domReady(() => {
	const { Fragment, createElement } = wp.element;
	const { PanelBody, ColorPalette } = wp.components;
	const { InspectorControls } = wp.blockEditor;

	const withArrowColorControl = createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			if (props.name !== 'core/paragraph') return createElement(BlockEdit, props);

			const { attributes, setAttributes } = props;
			const className = attributes.className || '';
			const isLeadingArrow = className.includes('is-style-leading-arrow');

			if (!isLeadingArrow) return createElement(BlockEdit, props);

			const currentColor = attributes.arrowColor || '';

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

	wp.hooks.addFilter('editor.BlockEdit', 'bk-theme/with-arrow-color-control', withArrowColorControl);

	// Apply the color to both editor + frontend output
	wp.hooks.addFilter(
		'blocks.getSaveContent.extraProps',
		'bk-theme/add-arrow-color-prop',
		(extraProps, blockType, attributes) => {
			if (blockType.name !== 'core/paragraph') return extraProps;
			if (!attributes.arrowColor) return extraProps;
			if (!attributes.className?.includes('is-style-leading-arrow')) return extraProps;

			extraProps.style = Object.assign({}, extraProps.style, {
				'--arrow-color': attributes.arrowColor,
			});
			return extraProps;
		}
	);
});

// =======================================================
// FINAL. ACTUAL. FIX. 🔥
// Force live arrow color updates even in Gutenberg iframe.
// =======================================================
wp.domReady(() => {
	const { subscribe, select } = wp.data;
	let lastInjectedCSS = '';

	const injectArrowColors = () => {
		const blocks = select('core/block-editor').getBlocks();
		const css = blocks
			.filter(
				(b) =>
					b.name === 'core/paragraph' &&
					b.attributes.className?.includes('is-style-leading-arrow') &&
					b.attributes.arrowColor
			)
			.map(
				(b) => `
				[data-block="${b.clientId}"].is-style-leading-arrow::before,
				[data-block="${b.clientId}"] .is-style-leading-arrow::before {
					color: ${b.attributes.arrowColor} !important;
				}
			`
			)
			.join('\n');

		if (css === lastInjectedCSS) return;
		lastInjectedCSS = css;

		// Look for the iframe or fallback to root editor DOM
		const iframe =
			document.querySelector('iframe[name="editor-canvas"]') ||
			document.querySelector('.block-editor-writing-flow') ||
			document.querySelector('.editor-styles-wrapper');

		if (!iframe) return;

		const doc = iframe.contentDocument || document;

		let styleEl = doc.getElementById('bk-arrow-live-style');
		if (!styleEl) {
			styleEl = doc.createElement('style');
			styleEl.id = 'bk-arrow-live-style';
			doc.head.appendChild(styleEl);
		}

		styleEl.textContent = css;
	};

	// Run initially + on every change
	subscribe(injectArrowColors);
	injectArrowColors();
});
