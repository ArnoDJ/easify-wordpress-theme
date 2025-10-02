(function () {
  const { createElement, RawHTML } = wp.element;
  const { useBlockProps, RichText, MediaUpload, InspectorControls } = wp.blockEditor;
  const { Button, PanelBody, ColorPalette } = wp.components;
  const { useSelect } = wp.data;

  wp.blocks.registerBlockType("bk-theme/feature-item", {
    title: "Feature Item",
    parent: ["bk-theme/feature-grid"],
    icon: "star-filled",
    category: "design",
    attributes: {
      iconSvg: { type: "string", default: "" },
      iconColor: { type: "string", default: "#fdbb30" },
      title: { type: "string", default: "Feature Title" },
      text: { type: "string", default: "Feature description goes here..." }
    },

    edit: function ({ attributes, setAttributes }) {
      const { iconSvg, iconColor, title, text } = attributes;
      const blockProps = useBlockProps({ className: "feature-item" });

      // Get theme palette colors
      const colors = useSelect((select) => {
        return select("core/block-editor").getSettings().colors || [];
      }, []);

      return createElement(
        "div",
        {},
        // Inspector sidebar
        createElement(
          InspectorControls,
          null,
          createElement(
            PanelBody,
            { title: "Icon Settings", initialOpen: true },
            createElement("p", null, "Icon color:"),
            createElement(ColorPalette, {
              colors: colors,
              value: iconColor,
              onChange: (color) => setAttributes({ iconColor: color })
            })
          )
        ),

        // Block UI
        createElement(
          "div",
          blockProps,
          // Icon uploader
          createElement(
            "div",
            { className: "feature-icon" },
            iconSvg
              ? createElement(RawHTML, {
                  className: "inline-svg",
                  style: { fill: iconColor }
                }, iconSvg)
              : null,
            createElement(MediaUpload, {
              onSelect: (media) => {
                fetch(media.url)
                  .then((res) => res.text())
                  .then((svg) => setAttributes({ iconSvg: svg }));
              },
              allowedTypes: ["image/svg+xml"],
              render: ({ open }) =>
                createElement(
                  Button,
                  { onClick: open, isSecondary: true },
                  iconSvg ? "Change Icon" : "Upload Icon"
                )
            })
          ),

          // Title + text
          createElement(
            "div",
            { className: "feature-content" },
            createElement(RichText, {
              tagName: "h3",
              value: title,
              onChange: (val) => setAttributes({ title: val }),
              placeholder: "Feature title..."
            }),
            createElement(RichText, {
              tagName: "p",
              value: text,
              onChange: (val) => setAttributes({ text: val }),
              placeholder: "Feature description..."
            })
          )
        )
      );
    },

    save: function ({ attributes }) {
      const { iconSvg, iconColor, title, text } = attributes;
      const blockProps = useBlockProps.save({ className: "feature-item" });

      return createElement(
        "div",
        blockProps,
        iconSvg
          ? createElement(RawHTML, {
              className: "inline-svg",
              style: `fill:${iconColor}`
            }, iconSvg)
          : null,
        createElement(
          "div",
          { className: "feature-content" },
          createElement(RichText.Content, { tagName: "h3", value: title }),
          createElement(RichText.Content, { tagName: "p", value: text })
        )
      );
    }
  });
})();
