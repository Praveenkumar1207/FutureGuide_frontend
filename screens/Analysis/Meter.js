// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import Svg, { G, Circle, Line, Text as SvgText, Path } from 'react-native-svg';
// const { width } = Dimensions.get('window');
// const size = width * 0.9;
// const center = size / 2;
// const radius = center - 40;
// const START_ANGLE = -Math.PI;
// const END_ANGLE = 0;

// const getCoord = (angle, r) => {
//     return {
//         x: center + r * Math.cos(angle),
//         y: center + r * Math.sin(angle),
//     };
// };
// const Meter = ({ value}) => {
//     const angle = (value / 100) * Math.PI + START_ANGLE;

//     return (
//         <View style={stylesx.container}>
//             <Svg width={size} height={center + 20}>
//                 <G rotation="0" origin={`${center}, ${center}`}>
//                     {/* Colored Arcs */}
//                     <Path
//                         d={`M ${getCoord(START_ANGLE, radius).x} ${getCoord(START_ANGLE, radius).y}
//                 A ${radius} ${radius} 0 0 1 ${getCoord(-Math.PI + (Math.PI * 0.3), radius).x} ${getCoord(-Math.PI + (Math.PI * 0.3), radius).y}`}
//                         stroke="red"
//                         strokeWidth={15}
//                         fill="none"
//                     />
//                     <Path
//                         d={`M ${getCoord(-Math.PI + (Math.PI * 0.3), radius).x} ${getCoord(-Math.PI + (Math.PI * 0.3), radius).y}
//                 A ${radius} ${radius} 0 0 1 ${getCoord(-Math.PI + (Math.PI * 0.7), radius).x} ${getCoord(-Math.PI + (Math.PI * 0.7), radius).y}`}
//                         stroke="orange"
//                         strokeWidth={15}
//                         fill="none"
//                     />
//                     <Path
//                         d={`M ${getCoord(-Math.PI + (Math.PI * 0.7), radius).x} ${getCoord(-Math.PI + (Math.PI * 0.7), radius).y}
//                 A ${radius} ${radius} 0 0 1 ${getCoord(END_ANGLE, radius).x} ${getCoord(END_ANGLE, radius).y}`}
//                         stroke="green"
//                         strokeWidth={15}
//                         fill="none"
//                     />

//                     {/* Ticks and Labels */}
//                     {[...Array(11)].map((_, i) => {
//                         const tickAngle = START_ANGLE + (i / 10) * Math.PI;
//                         const outer = getCoord(tickAngle, radius);
//                         const inner = getCoord(tickAngle, radius - 10);
//                         const label = getCoord(tickAngle, radius + 20);

//                         return (
//                             <G key={i}>
//                                 <Line
//                                     x1={inner.x}
//                                     y1={inner.y}
//                                     x2={outer.x}
//                                     y2={outer.y}
//                                     stroke="#000"
//                                     strokeWidth="2"
//                                 />
//                                 <SvgText
//                                     x={label.x}
//                                     y={label.y}
//                                     fill="#000"
//                                     fontSize="12"
//                                     textAnchor="middle"
//                                 >
//                                     {i * 10}
//                                 </SvgText>
//                             </G>
//                         );
//                     })}

//                     {/* Needle */}
//                     <Line
//                         x1={center}
//                         y1={center}
//                         x2={getCoord(angle, radius - 20).x}
//                         y2={getCoord(angle, radius - 20).y}
//                         stroke="black"
//                         strokeWidth="6"
//                         strokeLinecap="round"
//                     />
//                     <Circle cx={center} cy={center} r={10} fill="black" />
//                 </G>
//             </Svg>
//             <Text style={stylesx.valueText}>{value}</Text>
//         </View>
//     );
// };

// export default Meter;
// const stylesx = StyleSheet.create({
//     container: {
//         alignItems: 'center',
//         // backgroundColor: 'blue',
//     },
//     valueText: {
//         fontSize: 36,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
// });




import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { G, Circle, Line, Text as SvgText, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const size = width * 0.9;
const center = size / 2;
const radius = center - 40;
const START_ANGLE = -Math.PI;
const END_ANGLE = 0;

const getCoord = (angle, r) => ({
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle),
});

const Meter = ({ value }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [angle, setAngle] = useState(START_ANGLE);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();

        const id = animatedValue.addListener(({ value: val }) => {
            const currentAngle = START_ANGLE + (val / 100) * Math.PI;
            setAngle(currentAngle);
            setDisplayValue(Math.round(val));
        });

        return () => animatedValue.removeListener(id);
    }, [value]);

    const needleCoord = getCoord(angle, radius - 20);

    return (
        <View style={styles.container}>
            <Svg width={size} height={center + 20}>
                <G rotation="0" origin={`${center}, ${center}`}>
                    {/* Arcs */}
                    <Path
                        d={`M ${getCoord(START_ANGLE, radius).x} ${getCoord(START_ANGLE, radius).y}
                A ${radius} ${radius} 0 0 1 ${getCoord(START_ANGLE + Math.PI * 0.3, radius).x} ${getCoord(START_ANGLE + Math.PI * 0.3, radius).y}`}
                        stroke="red"
                        strokeWidth={15}
                        fill="none"
                    />
                    <Path
                        d={`M ${getCoord(START_ANGLE + Math.PI * 0.3, radius).x} ${getCoord(START_ANGLE + Math.PI * 0.3, radius).y}
                A ${radius} ${radius} 0 0 1 ${getCoord(START_ANGLE + Math.PI * 0.7, radius).x} ${getCoord(START_ANGLE + Math.PI * 0.7, radius).y}`}
                        stroke="orange"
                        strokeWidth={15}
                        fill="none"
                    />
                    <Path
                        d={`M ${getCoord(START_ANGLE + Math.PI * 0.7, radius).x} ${getCoord(START_ANGLE + Math.PI * 0.7, radius).y}
                A ${radius} ${radius} 0 0 1 ${getCoord(END_ANGLE, radius).x} ${getCoord(END_ANGLE, radius).y}`}
                        stroke="green"
                        strokeWidth={15}
                        fill="none"
                    />

                    {/* Ticks and Labels */}
                    {[...Array(11)].map((_, i) => {
                        const tickAngle = START_ANGLE + (i / 10) * Math.PI;
                        const outer = getCoord(tickAngle, radius);
                        const inner = getCoord(tickAngle, radius - 10);
                        const label = getCoord(tickAngle, radius + 20);

                        return (
                            <G key={i}>
                                <Line
                                    x1={inner.x}
                                    y1={inner.y}
                                    x2={outer.x}
                                    y2={outer.y}
                                    stroke="#000"
                                    strokeWidth="2"
                                />
                                <SvgText
                                    x={label.x}
                                    y={label.y}
                                    fill="#000"
                                    fontSize="12"
                                    textAnchor="middle"
                                >
                                    {i * 10}
                                </SvgText>
                            </G>
                        );
                    })}

                    {/* Needle */}
                    <Line
                        x1={center}
                        y1={center}
                        x2={needleCoord.x}
                        y2={needleCoord.y}
                        stroke="black"
                        strokeWidth={6}
                        strokeLinecap="round"
                    />
                    <Circle cx={center} cy={center} r={10} fill="black" />
                </G>
            </Svg>
            <Text style={styles.valueText}>{displayValue}</Text>
        </View>
    );
};

export default Meter;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    valueText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});



