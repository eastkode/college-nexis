<?php
/**
 * The template for displaying archive pages for the College CPT
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
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
				/* Start the Loop */
				while ( have_posts() ) :
					the_post();

					/*
					 * Include the Post-Type-specific template for the content.
					<?php
						the_archive_title( '<h1 class="page-title">', '</h1>' );
						the_archive_description( '<div class="archive-description">', '</div>' );
					?>
				</header><!-- .page-header -->

				<div class="college-listings-grid">
				<?php
				/* Start the Loop */
				while ( have_posts() ) :
					the_post();
					?>
					<article id="post-<?php the_ID(); ?>" <?php post_class('college-card'); ?>>
						<div class="college-card-inner">
							<?php
							$logo_image = get_field('college_logo_image');
							if ($logo_image && isset($logo_image['sizes']['medium'])) : ?>
								<div class="college-card-logo">
									<a href="<?php the_permalink(); ?>">
										<img src="<?php echo esc_url($logo_image['sizes']['medium']); ?>" alt="<?php echo esc_attr($logo_image['alt'] ?: get_the_title() . ' Logo'); ?>">
									</a>
								</div>
							<?php elseif (has_post_thumbnail()) : ?>
								<div class="college-card-logo">
									<a href="<?php the_permalink(); ?>">
										<?php the_post_thumbnail('medium'); ?>
									</a>
								</div>
							<?php endif; ?>

							<div class="college-card-content">
								<?php the_title(sprintf('<h2 class="entry-title college-card-title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h2>'); ?>

								<?php
								$city = get_field('college_city');
								$state = get_field('college_state');
								if ($city || $state) : ?>
									<p class="college-card-location">
										<?php if ($city) echo esc_html($city); ?>
										<?php if ($city && $state) echo ', '; ?>
										<?php if ($state) echo esc_html($state); ?>
									</p>
								<?php endif; ?>

								<?php
								$est_year = get_field('college_establishment_year');
								if ($est_year) : ?>
									<p class="college-card-est"><strong><?php esc_html_e('Estd:', 'collegenexis-theme'); ?></strong> <?php echo esc_html($est_year); ?></p>
								<?php endif; ?>

								<?php // Display a primary ranking if available
								if (have_rows('college_rankings')):
									$first_ranking = true;
									while(have_rows('college_rankings') && $first_ranking): the_row();
										$rank_provider = get_sub_field('rank_provider');
										$rank_value = get_sub_field('rank_value');
										if ($rank_provider && $rank_value): ?>
											<p class="college-card-rank">
												<strong><?php echo esc_html($rank_provider); ?>:</strong> <?php echo esc_html($rank_value); ?>
											</p>
										<?php
										$first_ranking = false; // Show only the first one for brevity in card
										endif;
									endwhile;
								endif;
								?>
								<a href="<?php the_permalink(); ?>" class="button college-card-button"><?php esc_html_e('View Details', 'collegenexis-theme'); ?></a>
							</div>
						</div>
					</article><!-- #post-<?php the_ID(); ?> -->
					<?php
				endwhile;
				?>
				</div> <!-- .college-listings-grid -->
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
