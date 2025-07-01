<?php
/**
 * The template for displaying archive pages for the Exam Update CPT
 *
 * @package College_Nexis_Theme
 */

get_header();
?>

	<main id="primary" class="site-main">
		<div class="container">
			<?php if ( have_posts() ) : ?>

				<header class="page-header">
					<?php
						the_archive_title( '<h1 class="page-title">', '</h1>' );
						the_archive_description( '<div class="archive-description">', '</div>' );
					?>
				</header><!-- .page-header -->

				<?php
					<?php
						the_archive_title( '<h1 class="page-title">', '</h1>' );
						the_archive_description( '<div class="archive-description">', '</div>' );
					?>
				</header><!-- .page-header -->

				<div class="exam-update-listings-list">
				<?php
				/* Start the Loop */
				while ( have_posts() ) :
					the_post();
					?>
					<article id="post-<?php the_ID(); ?>" <?php post_class('exam-update-card'); ?>>
						<div class="exam-update-card-inner">
							<div class="exam-update-card-content">
								<?php the_title(sprintf('<h2 class="entry-title exam-update-card-title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h2>'); ?>

								<div class="exam-update-card-meta">
									<?php
									$key_date = get_field('exam_update_date');
									if ($key_date): ?>
										<span class="key-date"><strong><?php esc_html_e('Date:', 'collegenexis-theme'); ?></strong> <?php echo esc_html(date_i18n(get_option('date_format'), strtotime($key_date))); ?></span>
									<?php endif; ?>

									<?php
									$update_type_value = get_field('exam_update_type');
									$update_type_label = '';
									$field_object = get_field_object('field_exam_update_type');
									if ($field_object && isset($field_object['choices'][$update_type_value])) {
										$update_type_label = $field_object['choices'][$update_type_value];
									}
									if ($update_type_label): ?>
										<span class="update-type"> | <strong><?php esc_html_e('Type:', 'collegenexis-theme'); ?></strong> <?php echo esc_html($update_type_label); ?></span>
									<?php endif; ?>
								</div>
                                <?php
                                $summary = get_field('exam_update_summary');
                                if ($summary) {
                                    echo '<p class="exam-update-card-summary">' . wp_kses_post(wp_trim_words($summary, 25, '...')) . '</p>';
                                } else {
                                    the_excerpt(); // Fallback to standard excerpt if summary is empty
                                }
                                ?>
								<a href="<?php the_permalink(); ?>" class="button exam-update-card-button"><?php esc_html_e('Read More', 'collegenexis-theme'); ?></a>
							</div>
						</div>
					</article><!-- #post-<?php the_ID(); ?> -->
					<?php
				endwhile;
				?>
				</div> <!-- .exam-update-listings-list -->
				<?php

				the_posts_navigation();

			else :

				get_template_part( 'template-parts/content', 'none' );

			endif;
			?>
		</div><!-- .container -->
	</main><!-- #main -->

<?php
get_footer();
