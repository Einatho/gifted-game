import { View, Text, TouchableOpacity } from 'react-native';
import { VisualQuestion as VisualQuestionType, Shape } from '@/utils/types';
import Svg, { Circle, Rect, Polygon, Path } from 'react-native-svg';

type VisualQuestionProps = {
  question: VisualQuestionType;
  onAnswer: (index: number) => void;
  disabled: boolean;
};

// Shape renderer component
function ShapeRenderer({ shape, size = 40 }: { shape: Shape; size?: number }) {
  const sizeMap = {
    small: size * 0.6,
    medium: size * 0.8,
    large: size,
  };
  
  const actualSize = sizeMap[shape.size];
  const halfSize = actualSize / 2;
  
  const renderShape = () => {
    switch (shape.type) {
      case 'circle':
        return (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={halfSize * 0.9}
            fill={shape.filled !== false ? shape.color : 'none'}
            stroke={shape.color}
            strokeWidth={shape.filled === false ? 2 : 0}
          />
        );
      
      case 'square':
        const squareOffset = (size - actualSize) / 2;
        return (
          <Rect
            x={squareOffset}
            y={squareOffset}
            width={actualSize * 0.9}
            height={actualSize * 0.9}
            fill={shape.filled !== false ? shape.color : 'none'}
            stroke={shape.color}
            strokeWidth={shape.filled === false ? 2 : 0}
            transform={shape.rotation ? `rotate(${shape.rotation}, ${size / 2}, ${size / 2})` : undefined}
          />
        );
      
      case 'triangle':
        const triPoints = `${size / 2},${(size - actualSize) / 2} ${(size + actualSize) / 2},${(size + actualSize) / 2} ${(size - actualSize) / 2},${(size + actualSize) / 2}`;
        return (
          <Polygon
            points={triPoints}
            fill={shape.filled !== false ? shape.color : 'none'}
            stroke={shape.color}
            strokeWidth={shape.filled === false ? 2 : 0}
            transform={shape.rotation ? `rotate(${shape.rotation}, ${size / 2}, ${size / 2})` : undefined}
          />
        );
      
      case 'star':
        const starPath = createStarPath(size / 2, size / 2, halfSize * 0.9, halfSize * 0.45, 5);
        return (
          <Path
            d={starPath}
            fill={shape.filled !== false ? shape.color : 'none'}
            stroke={shape.color}
            strokeWidth={shape.filled === false ? 2 : 0}
            transform={shape.rotation ? `rotate(${shape.rotation}, ${size / 2}, ${size / 2})` : undefined}
          />
        );
      
      case 'diamond':
        const diamondPoints = `${size / 2},${(size - actualSize) / 2} ${(size + actualSize * 0.6) / 2},${size / 2} ${size / 2},${(size + actualSize) / 2} ${(size - actualSize * 0.6) / 2},${size / 2}`;
        return (
          <Polygon
            points={diamondPoints}
            fill={shape.filled !== false ? shape.color : 'none'}
            stroke={shape.color}
            strokeWidth={shape.filled === false ? 2 : 0}
            transform={shape.rotation ? `rotate(${shape.rotation}, ${size / 2}, ${size / 2})` : undefined}
          />
        );
      
      case 'hexagon':
        const hexPoints = createHexagonPoints(size / 2, size / 2, halfSize * 0.9);
        return (
          <Polygon
            points={hexPoints}
            fill={shape.filled !== false ? shape.color : 'none'}
            stroke={shape.color}
            strokeWidth={shape.filled === false ? 2 : 0}
            transform={shape.rotation ? `rotate(${shape.rotation}, ${size / 2}, ${size / 2})` : undefined}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Svg width={size} height={size}>
      {renderShape()}
    </Svg>
  );
}

// Helper functions for complex shapes
function createStarPath(cx: number, cy: number, outerR: number, innerR: number, points: number): string {
  const step = Math.PI / points;
  let path = '';
  
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += (i === 0 ? 'M' : 'L') + x + ',' + y;
  }
  
  return path + 'Z';
}

function createHexagonPoints(cx: number, cy: number, r: number): string {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 30) * (Math.PI / 180);
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(' ');
}

export default function VisualQuestion({ question, onAnswer, disabled }: VisualQuestionProps) {
  return (
    <View className="flex-1">
      {/* Question Text */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-slate-800 text-right leading-8">
          {question.questionText}
        </Text>
      </View>

      {/* Shape Sequence Display */}
      <View className="bg-white rounded-2xl p-5 mb-6" style={{ elevation: 4 }}>
        <View className="flex-row flex-wrap justify-center items-center">
          {question.shapes.map((shape, index) => (
            <View key={index} className="flex-row items-center">
              <View className="bg-slate-50 rounded-xl p-2 mx-1 my-1">
                <ShapeRenderer shape={shape} size={50} />
              </View>
              {index < question.shapes.length - 1 && (
                <Text className="text-slate-300 text-lg mx-1">→</Text>
              )}
            </View>
          ))}
          <View className="bg-amber-50 rounded-xl p-2 mx-1 my-1 border-2 border-amber-400 border-dashed">
            <View className="w-[50px] h-[50px] items-center justify-center">
              <Text className="text-amber-500 text-2xl font-bold">?</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Options */}
      <View className="flex-row flex-wrap justify-between">
        {question.options.map((optionShapes, index) => (
          <View key={index} className="w-[48%] mb-3">
            <TouchableOpacity
              onPress={() => onAnswer(index)}
              disabled={disabled}
              activeOpacity={0.7}
              className={`bg-white rounded-2xl p-4 border-2 border-slate-200 ${disabled ? 'opacity-70' : ''}`}
              style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
            >
              <View className="flex-row items-center justify-center">
                <View className="flex-row items-center flex-wrap justify-center">
                  {optionShapes.map((shape, shapeIndex) => (
                    <View key={shapeIndex} className="mx-1">
                      <ShapeRenderer shape={shape} size={40} />
                    </View>
                  ))}
                </View>
              </View>
              <View className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-100 items-center justify-center">
                <Text className="text-orange-700 text-xs font-bold">
                  {String.fromCharCode(1488 + index)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
