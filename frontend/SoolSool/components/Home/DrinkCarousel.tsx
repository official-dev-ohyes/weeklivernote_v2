import { useRef, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { DrinkCarouselItem, ListItemWidth } from "./DrinkCarouselItem";
import { useSharedValue } from "react-native-reanimated";
import { useAppTheme } from "../../App";

interface Drink {
  id: number;
  name: string;
  volume: number;
  unit: string;
  alcoholPercentage: number;
}

type DrinkCarouselProps = {
  data: Drink[];
  sendData: (drink: Drink) => void;
};

const DrinkCarousel: React.FC<DrinkCarouselProps> = ({ data, sendData }) => {
  const {
    colors: { mainBlue },
  } = useAppTheme();
  const [centeredItem, setCenteredItem] = useState({
    id: 2,
    name: "소주",
    volume: 360,
    unit: "잔",
    alcoholPercentage: 19,
  });

  const contentOffset = useSharedValue(0);
  const flatListRef = useRef(null);

  const getCenterItemIndex = () => {
    const itemWidth = ListItemWidth;
    const centerOffsetX = contentOffset.value + itemWidth / 2;

    return Math.floor(centerOffsetX / itemWidth);
  };

  const handleMomentumScrollEnd = () => {
    const centerItemIndex = getCenterItemIndex();
    setCenteredItem(data[centerItemIndex]);
  };

  const handleClick = () => {
    sendData(centeredItem);
  };

  return (
    <View style={styles.rootcontainer}>
      <FlatList
        data={data}
        ref={flatListRef}
        keyExtractor={(_, index) => index.toString()}
        scrollEventThrottle={16} // 60fps -> 16ms (1000ms / 60fps)
        onScroll={(event) => {
          contentOffset.value = event.nativeEvent.contentOffset.x;
        }}
        pagingEnabled
        snapToInterval={ListItemWidth}
        style={{
          position: "absolute",
          bottom: 0,
          height: 300,
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 1.5 * ListItemWidth,
        }}
        horizontal
        renderItem={({ item, index }) => (
          <DrinkCarouselItem
            contentOffset={contentOffset}
            item={item}
            index={index}
          />
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />
      <Button
        onPress={handleClick}
        mode="text"
        textColor="white"
        buttonColor={mainBlue}
        style={styles.selectButton}
        labelStyle={styles.buttonText}
      >
        선택하기
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  rootcontainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 200,
  },
  selectButton: {
    padding: 4,
    paddingBottom: 0,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Yeongdeok-Sea",
  },
});

export { DrinkCarousel };
