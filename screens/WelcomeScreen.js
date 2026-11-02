import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

import { Colors } from "../utils/styles";

const PostItem = ({ title, description, author }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.itemTitle}>{title}</Text>
    <Text style={styles.itemDescription}>{description}</Text>
    <Text style={styles.itemAuthor}>By {author}</Text>
  </View>
);

function WelcomeScreen() {
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = () => {};// provide your implementation

  return (
    <View style={styles.rootContainer}>
      <FlatList
        onRefresh={fetchPosts}
        testID="Posts"
        refreshing={refreshing}
        data={fetchedPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostItem {...item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: Colors.primary800,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  itemDescription: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  itemAuthor: {
    fontSize: 12,
    color: Colors.primary100,
    marginTop: 5,
  },
});
