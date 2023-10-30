import { useRef } from "react";
import { FlatList, ImageProps, Text, Image, View } from "react-native";
import { DrinkCarouselItem, ListItemWidth } from "./DrinkCarouselItem";
import { useSharedValue } from "react-native-reanimated";

type DrinkCarouselProps = {
  data: ImageProps["source"][];
};

const DrinkCarousel: React.FC<DrinkCarouselProps> = ({ data }) => {
  const contentOffset = useSharedValue(0);
  const flatListRef = useRef(null);

  const getCenterItemIndex = () => {
    const itemWidth = ListItemWidth;
    const centerOffsetX = contentOffset.value + itemWidth / 2;

    return Math.floor(centerOffsetX / itemWidth);
  };

  const handleMomentumScrollEnd = () => {
    const centerItemIndex = getCenterItemIndex();
    const centerItem = data[centerItemIndex];

    console.log("Center Item Index:", centerItemIndex);
    console.log("Center Item Data:", centerItem);
  };

  return (
    <>
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
            imageSrc={item}
            index={index}
          />
        )}
        // onMomentumScrollEnd={handleMomentumScrollEnd}
      />
    </>
  );
};

export { DrinkCarousel };
