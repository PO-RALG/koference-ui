import { reactive, computed, onMounted } from "@vue/composition-api";

export const useTree = (props, { emit }): any => {
  onMounted(() => {
    if (props.currentItem) {
      data.expanded = true;
    }
  });

  const data = reactive({
    expanded: false,
  });

  const nodeClicked = () => {
    data.expanded = !data.expanded;
    emit("onClick", props.node);
  };

  const hasChildren = computed(() => {
    return props.node && "children" in props.node ? true : false;
  });

  const caption = computed(() => {
    return props.node[props.captionField];
  });

  const children = computed(() => {
    return props.node[props.childrenField];
  });

  const isActiveItem = computed(() => {
    return props.currentItem === props.node;
  });

  const level = computed(() => {
    return `${props.depth} + 1`;
  });

  return {
    data,

    nodeClicked,

    hasChildren,
    isActiveItem,
    level,

    caption,
    children,
  };
};
