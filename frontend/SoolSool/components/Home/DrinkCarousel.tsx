import { FlatList, ImageProps, Text } from "react-native";
import { DrinkCarouselItem, ListItemWidth } from "./DrinkCarouselItem";
import { useSharedValue } from "react-native-reanimated";

type DrinkCarouselProps = {
  //   data: ImageProps["source"][];
  data: number[];
};

const DrinkCarousel: React.FC<DrinkCarouselProps> = ({ data }) => {
  const contentOffset = useSharedValue(0);

  return (
    <>
      <Text>where are u</Text>
      <FlatList
        data={data}
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
          // paddingRight: 1.5 * ListItemWidth,
          // paddingLeft: 1.5 * ListItemWidth,
        }}
        horizontal
        renderItem={({ item, index }) => {
          return (
            <DrinkCarouselItem
              contentOffset={contentOffset}
              imageSrc={item}
              index={index}
            />
          );
        }}
      />
    </>
  );
};

export { DrinkCarousel };
