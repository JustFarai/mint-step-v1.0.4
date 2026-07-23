import 'package:flutter/material.dart';

class StepProgressIndicator extends StatelessWidget {
  final int count;
  final int goal;

  const StepProgressIndicator({
    super.key,
    required this.count,
    this.goal = 10000,
  });

  @override
  Widget build(BuildContext context) {
    final double percentage = (count / goal).clamp(0.0, 1.0);
    final theme = Theme.of(context);

    return Center(
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Circular Progress Track
          SizedBox(
            width: 220,
            height: 220,
            child: CircularProgressIndicator(
              value: percentage,
              strokeWidth: 16,
              backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
              color: theme.colorScheme.primary,
              strokeCap: StrokeCap.round,
            ),
          ),
          // Inner content
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.directions_run_rounded,
                size: 40,
                color: theme.colorScheme.primary,
              ),
              const SizedBox(height: 8),
              Text(
                count.toString(),
                style: theme.textTheme.displayLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'of $goal steps',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurface.withOpacity(0.6),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
