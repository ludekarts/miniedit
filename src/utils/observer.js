
// Observes givent node for node-add-event, and runs calback on that event.
export default function observer(observeNode, callback) {
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver((mutationsList, observerRef) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes[0]) {
         callback(mutation.addedNodes[0]);
      }
    }
  });

  // Start observing the target node for configured mutations
  observer.observe(observeNode, {
    subtree: true,
    childList: true,
    characterData: false,
  });
}