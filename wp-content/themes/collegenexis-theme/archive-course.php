<?php
/**
 * The template for displaying archive pages for the Course CPT
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

				<div class="course-listings-grid">
				<?php
				/* Start the Loop */
				while ( have_posts() ) :
					the_post();
					?>
					<article id="post-<?php the_ID(); ?>" <?php post_class('course-card'); ?>>
						<div class="course-card-inner">
							<?php
							$course_icon = get_field('course_icon');
							if ($course_icon && isset($course_icon['sizes']['thumbnail'])) : // Ensure 'thumbnail' size exists
								?>
								<div class="course-card-icon">
									<a href="<?php the_permalink(); ?>">
										<img src="<?php echo esc_url($course_icon['sizes']['thumbnail']); ?>" alt="<?php echo esc_attr($course_icon['alt'] ?: get_the_title() . ' Icon'); ?>">
									</a>
								</div>
							<?php endif; ?>

							<div class="course-card-content">
								<?php the_title(sprintf('<h2 class="entry-title course-card-title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h2>'); ?>

								<?php
								$course_cat_terms = get_the_terms(get_the_ID(), 'course_category');
								if ($course_cat_terms && !is_wp_error($course_cat_terms)) : ?>
									<p class="course-card-category">
										<strong><?php esc_html_e('Category:', 'collegenexis-theme'); ?></strong>
										<?php foreach($course_cat_terms as $term): ?>
											<a href="<?php echo esc_url(get_term_link($term)); ?>"><?php echo esc_html($term->name); ?></a>
										<?php endforeach; ?>
									</p>
								<?php endif; ?>

								<?php
								$summary = get_field('course_summary_short');
								if ($summary) : ?>
									<p class="course-card-summary"><?php echo esc_html($summary); ?></p>
								<?php else :
									$duration = get_field('course_duration_details');
									if ($duration) : ?>
										<p class="course-card-duration"><strong><?php esc_html_e('Duration:', 'collegenexis-theme'); ?></strong> <?php echo esc_html($duration); ?></p>
									<?php endif; ?>
								<?php endif; ?>

								<a href="<?php the_permalink(); ?>" class="button course-card-button"><?php esc_html_e('Learn More', 'collegenexis-theme'); ?></a>
							</div>
						</div>
					</article><!-- #post-<?php the_ID(); ?> -->
					<?php
				endwhile;
				?>
				</div> <!-- .course-listings-grid -->
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
