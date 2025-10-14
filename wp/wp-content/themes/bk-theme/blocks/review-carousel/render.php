<?php
$title = $attributes['title'] ?? '';
$reviews = $attributes['reviews'] ?? [];
if (empty($reviews)) return;

// Repeat the array 3× for a smooth endless track
$loopSlides = array_merge($reviews, $reviews, $reviews);
?>

<div class="bk-review-carousel swiper" data-swiper>
  <?php if (!empty($title)) : ?>
    <h2 class="bk-review-carousel-title">
      <?php echo esc_html($title); ?>
    </h2>
  <?php endif; ?>

  <div class="swiper-wrapper">
    <?php foreach ($loopSlides as $i => $review): ?>
      <div class="swiper-slide"
           data-text="<?php echo esc_attr($review['text'] ?? ''); ?>"
           data-name="<?php echo esc_attr($review['name'] ?? ''); ?>"
           data-title="<?php echo esc_attr($review['title'] ?? ''); ?>">
        <div class="bk-carousel-logo-wrapper">
          <div class="bk-carousel-logo">
            <img src="<?php echo esc_url($review['logo'] ?? ''); ?>" alt="">
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

  <div class="swiper-button-prev">
    <i class="fa-solid fa-angle-left"></i>
  </div>
  <div class="swiper-button-next">
    <i class="fa-solid fa-angle-right"></i>
  </div>

  <div class="bk-carousel-content">
    <p class="bk-review-text"></p>
    <p class="bk-review-author"></p>
  </div>
</div>
