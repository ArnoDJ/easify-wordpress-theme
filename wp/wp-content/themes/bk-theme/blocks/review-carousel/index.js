(function (blocks, element, blockEditor, components, i18n) {
  const { registerBlockType } = blocks;
  const { createElement: el } = element;
  const { MediaUpload, MediaUploadCheck, RichText, useBlockProps } = blockEditor;
  const { Button } = components;
  const { __ } = i18n;

  registerBlockType("bk-theme/review-carousel", {
    title: __("Review Carousel", "bk-theme"),
    icon: "format-quote",
    category: "widgets",

    attributes: {
      reviews: {
        type: "array",
        default: []
      }
    },

    edit: function (props) {
      const { attributes, setAttributes } = props;
      const { reviews } = attributes;

      const blockProps = useBlockProps({
        className: "bk-review-carousel-editor",
      });

      function addReview() {
        const newReviews = [
          ...reviews,
          { logo: "", text: "", name: "", title: "" },
        ];
        setAttributes({ reviews: newReviews });
      }

      function updateReview(index, key, value) {
        const newReviews = [...reviews];
        newReviews[index][key] = value;
        setAttributes({ reviews: newReviews });
      }

      function removeReview(index) {
        const newReviews = reviews.filter((_, i) => i !== index);
        setAttributes({ reviews: newReviews });
      }

      return el(
        "div",
        blockProps,
        reviews.map(function (review, index) {
          return el(
            "div",
            { key: index, className: "bk-review-item-editor" },
            // --- Logo Upload ---
            el(MediaUploadCheck, null,
              el(MediaUpload, {
                onSelect: function (media) {
                  updateReview(index, "logo", media.url);
                },
                render: function (obj) {
                  return el(
                    Button,
                    { onClick: obj.open, className: "bk-upload-btn" },
                    review.logo
                      ? el("img", { src: review.logo, style: { height: "40px" } })
                      : __("Upload Logo", "bk-theme")
                  );
                }
              })
            ),

            // --- Review Text ---
            el(RichText, {
              tagName: "p",
              placeholder: __("Review text...", "bk-theme"),
              value: review.text,
              onChange: function (value) {
                updateReview(index, "text", value);
              }
            }),

            // --- Reviewer Name ---
            el(RichText, {
              tagName: "p",
              className: "bk-review-name",
              placeholder: __("Reviewer name", "bk-theme"),
              value: review.name,
              onChange: function (value) {
                updateReview(index, "name", value);
              }
            }),

            // --- Reviewer Title ---
            el(RichText, {
              tagName: "p",
              className: "bk-review-title",
              placeholder: __("Reviewer title", "bk-theme"),
              value: review.title,
              onChange: function (value) {
                updateReview(index, "title", value);
              }
            }),

            // --- Remove Button ---
            el(
              Button,
              {
                isDestructive: true,
                onClick: function () {
                  removeReview(index);
                },
              },
              __("Remove Review", "bk-theme")
            )
          );
        }),

        // --- Add Review Button ---
        el(
          Button,
          { variant: "primary", onClick: addReview },
          __("Add Review", "bk-theme")
        )
      );
    },

    save: function () {
      // Frontend output handled by PHP render callback
      return null;
    },
  });
})(
  window.wp.blocks,
  window.wp.element,
  window.wp.blockEditor || window.wp.editor,
  window.wp.components,
  window.wp.i18n
);
