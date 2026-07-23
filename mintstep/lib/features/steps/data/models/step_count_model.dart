import 'package:mintstep/features/steps/domain/entities/step_count.dart';

class StepCountModel extends StepCount {
  const StepCountModel({
    required super.id,
    required super.count,
    required super.date,
    required super.caloriesBurned,
    required super.distanceKm,
    super.isSynced,
  });

  factory StepCountModel.fromJson(Map<String, dynamic> json) {
    return StepCountModel(
      id: json['id'] as String,
      count: json['count'] as int,
      date: DateTime.parse(json['date'] as String),
      caloriesBurned: (json['caloriesBurned'] as num).toDouble(),
      distanceKm: (json['distanceKm'] as num).toDouble(),
      isSynced: json['isSynced'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'count': count,
      'date': date.toIso8601String(),
      'caloriesBurned': caloriesBurned,
      'distanceKm': distanceKm,
      'isSynced': isSynced,
    };
  }

  factory StepCountModel.fromEntity(StepCount entity) {
    return StepCountModel(
      id: entity.id,
      count: entity.count,
      date: entity.date,
      caloriesBurned: entity.caloriesBurned,
      distanceKm: entity.distanceKm,
      isSynced: entity.isSynced,
    );
  }

  StepCountModel copyWith({
    String? id,
    int? count,
    DateTime? date,
    double? caloriesBurned,
    double? distanceKm,
    bool? isSynced,
  }) {
    return StepCountModel(
      id: id ?? this.id,
      count: count ?? this.count,
      date: date ?? this.date,
      caloriesBurned: caloriesBurned ?? this.caloriesBurned,
      distanceKm: distanceKm ?? this.distanceKm,
      isSynced: isSynced ?? this.isSynced,
    );
  }
}
