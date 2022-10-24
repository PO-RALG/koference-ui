import { reactive, computed, onMounted } from "vue";

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
    if (props.node.children) {
      data.expanded = !data.expanded;
      emit("onClick", props.node);
    } else {
      emit("onClick", props.node);
    }
  };

  const hasExtraIcon = computed(() => {
    return props.icon? true : false;
  });

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

  const hasAttachment = computed(() => {
    return props.node.template_uri;
  });

  const level = computed(() => {
    return `${props.depth} + 1`;
  });

  return {
    data,

    nodeClicked,

    hasChildren,
    hasAttachment,
    isActiveItem,
    level,

    caption,
    children,
    hasExtraIcon,
  };
};
