<?php
/**
 * The template for displaying all single Exam Update posts
 *
 * @package College_Nexis_Theme
 */

get_header();
?>

	<main id="primary" class="site-main">
		<div class="container">
			<?php
			while ( have_posts() ) :
				the_post();

				the_post();
				?>
				<article id="post-<?php the_ID(); ?>" <?php post_class('exam-update-profile'); ?>>
					<header class="entry-header exam-update-header">
						<?php the_title('<h1 class="entry-title exam-update-name">', '</h1>'); ?>

						<div class="exam-update-meta">
							<?php if ($key_date = get_field('exam_update_date')): ?>
								<span class="key-date"><strong><?php esc_html_e('Key Date:', 'collegenexis-theme'); ?></strong> <?php echo esc_html(date_i18n(get_option('date_format'), strtotime($key_date))); ?></span>
							<?php endif; ?>
							<?php
							$update_type_value = get_field('exam_update_type');
							$update_type_label = '';
							$field_object = get_field_object('field_exam_update_type'); // Get field object to access choices
							if ($field_object && isset($field_object['choices'][$update_type_value])) {
								$update_type_label = $field_object['choices'][$update_type_value];
							}
							?>
							<?php if ($update_type_label): ?>
								<span class="update-type"><strong><?php esc_html_e('Update Type:', 'collegenexis-theme'); ?></strong> <?php echo esc_html($update_type_label); ?></span>
							<?php endif; ?>
						</div>
					</header><!-- .entry-header -->

					<div class="entry-content exam-update-details-content">

						<?php if ($summary = get_field('exam_update_summary')): ?>
						<section id="exam-update-summary-details" class="exam-update-section">
							<h2><?php esc_html_e('Summary of Update', 'collegenexis-theme'); ?></h2>
							<?php echo wp_kses_post($summary); ?>
						</section>
						<?php endif; ?>

                        <?php // Main Post Content (Detailed Description if any)
                        if (get_the_content()): ?>
                        <section id="exam-update-detailed-info" class="exam-update-section">
                            <h2><?php esc_html_e('Detailed Information', 'collegenexis-theme'); ?></h2>
                            <?php the_content(); ?>
                        </section>
                        <?php endif; ?>

						<?php if ($official_link = get_field('exam_update_official_link')): ?>
						<section id="exam-update-official-link" class="exam-update-section">
							<p>
                                <strong><?php esc_html_e('Official Link:', 'collegenexis-theme'); ?></strong>
                                <a href="<?php echo esc_url($official_link); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($official_link); ?></a>
                            </p>
						</section>
						<?php endif; ?>

						<?php
						$related_courses = get_field('exam_update_related_course');
						if ($related_courses): ?>
						<section id="exam-update-related-courses" class="exam-update-section">
							<h2><?php esc_html_e('Related Course(s)', 'collegenexis-theme'); ?></h2>
							<ul>
								<?php foreach ($related_courses as $course_post): ?>
									<li><a href="<?php echo esc_url(get_permalink($course_post->ID)); ?>"><?php echo esc_html(get_the_title($course_post->ID)); ?></a></li>
								<?php endforeach; ?>
							</ul>
						</section>
						<?php endif; ?>

					</div><!-- .entry-content -->

					<footer class="entry-footer">
						<?php edit_post_link(esc_html__('Edit This Update', 'collegenexis-theme'), '<span class="edit-link">', '</span>'); ?>
					</footer><!-- .entry-footer -->
				</article><!-- #post-<?php the_ID(); ?> -->
				<?php

				// Exam updates might not need comments, but the option is here
				if ( comments_open() || get_comments_number() ) :
					comments_template();
				endif;

				the_post_navigation(
					array(
						'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous Update:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',
						'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next Update:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',
					)
				);

			endwhile; // End of the loop.
			?>
		</div><!-- .container -->
	</main><!-- #main -->

<?php
get_footer();
