import 'package:hive_flutter/hive_flutter.dart';
import 'package:mintstep/features/steps/data/models/step_count_model.dart';

abstract class StepsLocalDataSource {
  Future<StepCountModel?> getLastStepCount(DateTime date);
  Future<void> cacheStepCount(StepCountModel stepCount);
  Future<List<StepCountModel>> getPendingSync();
}

class StepsLocalDataSourceImpl implements StepsLocalDataSource {
  final Box _box;

  StepsLocalDataSourceImpl(this._box);

  @override
  Future<StepCountModel?> getLastStepCount(DateTime date) async {
    final String dateStr = _getFormattedDateKey(date);
    final json = _box.get(dateStr);
    if (json != null) {
      return StepCountModel.fromJson(Map<String, dynamic>.from(json));
    }
    return null;
  }

  @override
  Future<void> cacheStepCount(StepCountModel stepCount) async {
    final String dateStr = _getFormattedDateKey(stepCount.date);
    await _box.put(dateStr, stepCount.toJson());
  }

  @override
  Future<List<StepCountModel>> getPendingSync() async {
    final pending = <StepCountModel>[];
    for (var key in _box.keys) {
      final json = _box.get(key);
      if (json != null) {
        final model = StepCountModel.fromJson(Map<String, dynamic>.from(json));
        if (!model.isSynced) {
          pending.add(model);
        }
      }
    }
    return pending;
  }

  String _getFormattedDateKey(DateTime date) {
    return "${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}";
  }
}
