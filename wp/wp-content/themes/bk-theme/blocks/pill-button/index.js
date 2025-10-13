(function () {
  const { createElement: el } = wp.element;
  const { __ } = wp.i18n;
  const { useBlockProps, RichText, InspectorControls, PanelColorSettings } = wp.blockEditor;
  const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl } = wp.components;

  wp.blocks.registerBlockType("bk-theme/pill-button", {
    title: __("Pill Button", "bk-theme"),
    icon: "admin-links",
    category: "design",
    attributes: {
      text: { type: "string", default: "Zin in een kennismaking?" },
      url: { type: "string", default: "" },
      backgroundColor: { type: "string", default: "var(--wp--preset--color--yellow)" },
      textColor: { type: "string", default: "var(--wp--preset--color--dark-blue)" },
      arrowColor: { type: "string", default: "var(--wp--preset--color--dark-blue)" },
      paddingSize: { type: "string", default: "normal" },
      overlapEnabled: { type: "boolean", default: false },
      offsetX: { type: "number", default: 0 },
      offsetY: { type: "number", default: 0 }
    },

    edit: function ({ attributes, setAttributes }) {
      const { text, url, backgroundColor, textColor, arrowColor, paddingSize, overlapEnabled, offsetX, offsetY } = attributes;
      const style = { backgroundColor, color: textColor };

      if (overlapEnabled) {
        style.position = "relative";
        style.left = `${offsetX || 0}px`;
        style.top = `${offsetY || 0}px`;
      }

      const blockProps = useBlockProps({
        className: `pill pill--${paddingSize}${overlapEnabled ? " pill--overlap" : ""}`,
        style
      });

      return [
        el(
          InspectorControls,
          {},
          el(
            PanelBody,
            { title: __("Button Settings", "bk-theme"), initialOpen: true },
            el(TextControl, {
              label: __("Button URL", "bk-theme"),
              value: url,
              onChange: (v) => setAttributes({ url: v })
            }),
            el(SelectControl, {
              label: __("Padding Size", "bk-theme"),
              value: paddingSize,
              options: [
                { label: __("Small", "bk-theme"), value: "small" },
                { label: __("Normal", "bk-theme"), value: "normal" },
                { label: __("Large", "bk-theme"), value: "large" }
              ],
              onChange: (v) => setAttributes({ paddingSize: v })
            })
          ),
          el(PanelColorSettings, {
            title: __("Colors", "bk-theme"),
            colorSettings: [
              { value: backgroundColor, onChange: (v) => setAttributes({ backgroundColor: v }), label: __("Background", "bk-theme") },
              { value: textColor, onChange: (v) => setAttributes({ textColor: v }), label: __("Text", "bk-theme") },
              { value: arrowColor, onChange: (v) => setAttributes({ arrowColor: v }), label: __("Arrow", "bk-theme") }
            ]
          }),
          el(
            PanelBody,
            { title: __("Overlap Controls", "bk-theme"), initialOpen: true },
            el(ToggleControl, {
              label: __("Enable Overlap", "bk-theme"),
              checked: !!overlapEnabled,
              onChange: (v) => setAttributes({ overlapEnabled: !!v }),
              help: __("Move the pill up/down/left/right over nearby elements", "bk-theme")
            }),
            el(RangeControl, {
              label: __("Horizontal Offset (px)", "bk-theme"),
              min: -240,
              max: 240,
              step: 1,
              value: offsetX || 0,
              onChange: (v) => setAttributes({ offsetX: Number(v) || 0 }),
              disabled: !overlapEnabled
            }),
            el(RangeControl, {
              label: __("Vertical Offset (px)", "bk-theme"),
              min: -240,
              max: 240,
              step: 1,
              value: offsetY || 0,
              onChange: (v) => setAttributes({ offsetY: Number(v) || 0 }),
              disabled: !overlapEnabled
            })
          )
        ),
        el(
          "a",
          { ...blockProps, href: url || "#" },
          el(RichText, {
            tagName: "span",
            className: "pill-text",
            value: text,
            onChange: (v) => setAttributes({ text: v }),
            placeholder: __("Button text…", "bk-theme")
          }),
          el("span", {
            className: "pill-icon",
            dangerouslySetInnerHTML: {
              __html:
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' +
                arrowColor +
                '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>'
            }
          })
        )
      ];
    },

    save: function ({ attributes }) {
      const { text, url, backgroundColor, textColor, arrowColor, paddingSize, overlapEnabled, offsetX, offsetY } = attributes;
      const style = { backgroundColor, color: textColor };

      if (overlapEnabled) {
        style.position = "relative";
        style.left = `${offsetX || 0}px`;
        style.top = `${offsetY || 0}px`;
      }

      const blockProps = wp.blockEditor.useBlockProps.save({
        className: `pill pill--${paddingSize}${overlapEnabled ? " pill--overlap" : ""}`,
        style
      });

      return el(
        "a",
        { ...blockProps, href: url || "#" },
        el(wp.blockEditor.RichText.Content, { tagName: "span", className: "pill-text", value: text }),
        el("span", {
          className: "pill-icon",
          dangerouslySetInnerHTML: {
            __html:
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' +
              arrowColor +
              '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>'
          }
        })
      );
    }
  });
})();
