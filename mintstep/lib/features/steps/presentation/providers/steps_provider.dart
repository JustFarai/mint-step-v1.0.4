import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:mintstep/features/steps/data/datasources/steps_local_datasource.dart';
import 'package:mintstep/features/steps/data/datasources/steps_remote_datasource.dart';
import 'package:mintstep/features/steps/data/repositories/steps_repository_impl.dart';
import 'package:mintstep/features/steps/domain/entities/step_count.dart';
import 'package:mintstep/features/steps/domain/repositories/steps_repository.dart';
import 'package:mintstep/features/steps/domain/usecases/get_daily_steps.dart';
import 'package:mintstep/features/steps/domain/usecases/sync_steps.dart';

// 1. Core Data-Source and Repository Providers (Dependency Injection Layer)
final stepsLocalDataSourceProvider = Provider<StepsLocalDataSource>((ref) {
  final box = Hive.box('steps_box');
  return StepsLocalDataSourceImpl(box);
});

final stepsRemoteDataSourceProvider = Provider<StepsRemoteDataSource>((ref) {
  return StepsRemoteDataSourceImpl();
});

final stepsRepositoryProvider = Provider<StepsRepository>((ref) {
  return StepsRepositoryImpl(
    localDataSource: ref.watch(stepsLocalDataSourceProvider),
    remoteDataSource: ref.watch(stepsRemoteDataSourceProvider),
  );
});

// 2. Use-Case Providers
final getDailyStepsUseCaseProvider = Provider<GetDailySteps>((ref) {
  return GetDailySteps(ref.watch(stepsRepositoryProvider));
});

final syncStepsUseCaseProvider = Provider<SyncSteps>((ref) {
  return SyncSteps(ref.watch(stepsRepositoryProvider));
});

// 3. State Notifier and State Provider
class StepsState {
  final StepCount? currentSteps;
  final bool isLoading;
  final String? errorMessage;
  final bool isSyncing;

  const StepsState({
    this.currentSteps,
    this.isLoading = false,
    this.errorMessage,
    this.isSyncing = false,
  });

  StepsState copyWith({
    StepCount? currentSteps,
    bool? isLoading,
    String? errorMessage,
    bool? isSyncing,
  }) {
    return StepsState(
      currentSteps: currentSteps ?? this.currentSteps,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
      isSyncing: isSyncing ?? this.isSyncing,
    );
  }
}

class StepsNotifier extends StateNotifier<StepsState> {
  final GetDailySteps _getDailySteps;
  final SyncSteps _syncSteps;
  final StepsRepository _repository;

  StepsNotifier({
    required GetDailySteps getDailySteps,
    required SyncSteps syncSteps,
    required StepsRepository repository,
  })  : _getDailySteps = getDailySteps,
        _syncSteps = syncSteps,
        _repository = repository,
        super(const StepsState()) {
    fetchTodaySteps();
  }

  Future<void> fetchTodaySteps() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    final today = DateTime.now();
    final result = await _getDailySteps(today);

    result.fold(
      (failure) => state = state.copyWith(isLoading: false, errorMessage: failure.message),
      (steps) => state = state.copyWith(isLoading: false, currentSteps: steps),
    );
  }

  Future<void> addSteps(int incrementalCount) async {
    final current = state.currentSteps;
    if (current == null) return;

    final newCount = current.count + incrementalCount;
    // Calculation metrics (e.g. approx. 0.04 calories/step, 0.00075 km/step)
    final newCalories = newCount * 0.04;
    final newDistance = newCount * 0.00075;

    final updatedSteps = StepCount(
      id: current.id,
      count: newCount,
      date: current.date,
      caloriesBurned: newCalories,
      distanceKm: newDistance,
      isSynced: false,
    );

    state = state.copyWith(currentSteps: updatedSteps);
    
    // Save locally and background sync
    await _repository.saveSteps(updatedSteps);
  }

  Future<void> triggerSync() async {
    state = state.copyWith(isSyncing: true);
    final result = await _syncSteps(const NoParams());
    
    result.fold(
      (failure) => state = state.copyWith(isSyncing: false, errorMessage: "Sync failed: ${failure.message}"),
      (_) {
        state = state.copyWith(isSyncing: false);
        fetchTodaySteps(); // Refresh state from cache
      },
    );
  }
}

final stepsNotifierProvider = StateNotifierProvider<StepsNotifier, StepsState>((ref) {
  return StepsNotifier(
    getDailySteps: ref.watch(getDailyStepsUseCaseProvider),
    syncSteps: ref.watch(syncStepsUseCaseProvider),
    repository: ref.watch(stepsRepositoryProvider),
  );
});
