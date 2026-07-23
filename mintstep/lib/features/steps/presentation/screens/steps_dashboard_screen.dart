import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mintstep/app.dart';
import 'package:mintstep/features/steps/presentation/providers/steps_provider.dart';
import 'package:mintstep/features/steps/presentation/widgets/step_progress_indicator.dart';

class StepsDashboardScreen extends ConsumerWidget {
  const StepsDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(stepsNotifierProvider);
    final theme = Theme.of(context);
    final themeMode = ref.watch(themeModeProvider);

    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      appBar: AppBar(
        title: const Text('MintStep'),
        actions: [
          // Toggle Theme Mode
          IconButton(
            icon: Icon(themeMode == ThemeMode.dark ? Icons.light_mode : Icons.dark_mode),
            onPressed: () {
              ref.read(themeModeProvider.notifier).update(
                (mode) => mode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark,
              );
            },
          ),
          // Offline/Online Status + Cloud Sync Trigger
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                icon: Icon(
                  state.isSyncing ? Icons.sync : Icons.cloud_done_rounded,
                  color: state.currentSteps?.isSynced == true ? Colors.green : Colors.amber,
                ),
                onPressed: state.isSyncing
                    ? null
                    : () {
                        ref.read(stepsNotifierProvider.notifier).triggerSync();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Syncing with cloud database...')),
                        );
                      },
              ),
              if (state.isSyncing)
                const Positioned(
                  right: 4,
                  bottom: 4,
                  child: SizedBox(
                    width: 12,
                    height: 12,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.green,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: state.isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => ref.read(stepsNotifierProvider.notifier).fetchTodaySteps(),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Date header
                    Text(
                      'Today\'s Progress',
                      textAlign: TextAlign.center,
                      style: theme.textTheme.titleMedium?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.6),
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Beautiful Main Steps Circular Indicator
                    Card(
                      elevation: 0,
                      color: theme.colorScheme.primary.withOpacity(0.04),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 30),
                        child: StepProgressIndicator(
                          count: state.currentSteps?.count ?? 0,
                          goal: 10000,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Metrics Grid (Calories, Distance)
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard(
                            context: context,
                            title: 'Calories Burned',
                            value: '${state.currentSteps?.caloriesBurned.toStringAsFixed(1) ?? '0.0'} kcal',
                            icon: Icons.local_fire_department_rounded,
                            iconColor: Colors.orange,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildMetricCard(
                            context: context,
                            title: 'Distance',
                            value: '${state.currentSteps?.distanceKm.toStringAsFixed(2) ?? '0.00'} km',
                            icon: Icons.map_rounded,
                            iconColor: Colors.blue,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Synchronization Status Banner
                    _buildSyncStatusBanner(context, state.currentSteps?.isSynced ?? false),
                    const SizedBox(height: 24),

                    // Simulation Action (Representing Senior Architect Interactive Testing tool)
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.colorScheme.primary,
                        foregroundColor: theme.colorScheme.onPrimary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        elevation: 0,
                      ),
                      icon: const Icon(Icons.nordic_walking_rounded),
                      label: const Text(
                        'Simulate taking +1,000 Steps',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      onPressed: () {
                        ref.read(stepsNotifierProvider.notifier).addSteps(1000);
                        // Optional micro feedback
                        Feedback.forTap(context);
                      },
                    ),

                    if (state.errorMessage != null) ...[
                      const SizedBox(height: 16),
                      Text(
                        state.errorMessage!,
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.redAccent, fontSize: 13),
                      ),
                    ],
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildMetricCard({
    required BuildContext context,
    required String title,
    required String value,
    required IconData icon,
    required Color iconColor,
  }) {
    final theme = Theme.of(context);
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: theme.colorScheme.onSurface.withOpacity(0.08)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CircleAvatar(
              backgroundColor: iconColor.withOpacity(0.1),
              radius: 20,
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(height: 16),
            Text(
              value,
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                fontSize: 22,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.5),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSyncStatusBanner(BuildContext context, bool isSynced) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isSynced ? Colors.green.withOpacity(0.05) : Colors.amber.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: BorderSide(
          color: isSynced ? Colors.green.withOpacity(0.2) : Colors.amber.withOpacity(0.2),
        ),
      ),
      child: Row(
        children: [
          Icon(
            isSynced ? Icons.cloud_done_rounded : Icons.cloud_queue_rounded,
            color: isSynced ? Colors.green : Colors.amber,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isSynced ? 'Synced with Firestore' : 'Offline Mode (Pending Cloud Sync)',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: isSynced ? Colors.green.shade800 : Colors.amber.shade900,
                  ),
                ),
                Text(
                  isSynced
                      ? 'All changes are safely stored in your cloud profile.'
                      : 'Data is securely saved on device. Tap cloud icon to sync.',
                  style: TextStyle(
                    fontSize: 12,
                    color: isSynced ? Colors.green.shade700 : Colors.amber.shade900.withOpacity(0.8),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
